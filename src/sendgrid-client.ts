// @ts-ignore
import Client from "@sendgrid/client/src/classes/client";
import { ISender, SendArgs } from "./sender";
import { getHtml } from "./templates/newsletter";

type Opts = {
  sendgridApiKey: string;
  listName: string;
  senderId: string;
  unsubscribeUrl?: string;
  unsubscribeGroup?: number;
};

type Recipient = {
  email: string;
  lastName?: string;
  firstName?: string;
};

export class SendgridClient implements ISender {
  client: Client;
  opts: Opts;
  listId: number;

  constructor(opts: Opts) {
    this.client = new Client();
    this.client.setApiKey(opts.sendgridApiKey);
    this.opts = opts;
    this.createListIfNotExists();
  }

  async createListIfNotExists(): Promise<void> {
    try {
      const request = {
        method: "GET",
        url: `/v3/contactdb/lists`
      };
      const [, body] = await this.client.request(request);
      for (let i = 0; i < body.lists.length; i++) {
        const list = body.lists[i];
        if (list.name === this.opts.listName) {
          this.listId = list.id;
          return;
        }
      }
      await this.createList();
    } catch (e) {
      await this.createList();
    }
  }

  async createList(): Promise<void> {
    try {
      const request = {
        method: "POST",
        url: `/v3/contactdb/lists`,
        body: {
          name: this.opts.listName
        }
      };
      const [, body] = await this.client.request(request);
      this.listId = body.id;
    } catch (e) {
      throw new Error(
        `failed to createList: ${JSON.stringify(e.response.body.errors)}`
      );
    }
  }

  async addToList(recipients: Array<Recipient>): Promise<void> {
    if (!this.listId) {
      await this.createListIfNotExists();
    }
    try {
      const reqRecipients = recipients.map(recipient => ({
        email: recipient.email,
        last_name: recipient.lastName,
        first_name: recipient.firstName
      }));
      let resRecipients: Array<string> = [];
      do {
        /*
        Important note:
        1. limit 1000 recipients per request
        2. max 3 requests per 2 seconds
        ref. https://sendgrid.api-docs.io/v3.0/contacts-api-recipients/add-recipients
        */
        const startMs = Date.now();
        const addRecipientReq = {
          method: "POST",
          url: `/v3/contactdb/recipients`,
          body: reqRecipients.splice(0, 1000)
        };
        const [, addRecipientResBody] = await this.client.request(
          addRecipientReq
        );
        resRecipients = [
          ...resRecipients,
          ...addRecipientResBody.persisted_recipients
        ];
        const delay = Math.max(2000 / 3 - (Date.now() - startMs), 0);
        if (delay) {
          // tslint:disable-next-line: no-string-based-set-timeout
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } while (reqRecipients.length > 0);
      const addListReq = {
        method: "POST",
        url: `/v3/contactdb/lists/${this.listId}/recipients`,
        body: resRecipients
      };
      await this.client.request(addListReq);
    } catch (e) {
      throw new Error(
        `failed to addToList: ${JSON.stringify(e.response.body.errors)}`
      );
    }
  }

  // tslint:disable-next-line:no-any
  async getSenders(): Promise<any> {
    const [, body] = await this.client.request({
      method: "GET",
      url: "/v3/senders"
    });
    return body;
  }

  // tslint:disable-next-line:no-any
  async getUnsubscribeGroups(): Promise<any> {
    const [, body] = await this.client.request({
      method: "GET",
      url: "/v3/asm/groups"
    });
    return body;
  }

  async send(sendArgs: SendArgs): Promise<string | boolean> {
    if (!this.listId) {
      await this.createListIfNotExists();
    }
    try {
      const createCampaignReq = {
        method: "POST",
        url: `/v3/campaigns`,
        body: {
          title: sendArgs.title,
          subject: sendArgs.title,
          sender_id: this.opts.senderId,
          suppression_group_id: this.opts.unsubscribeGroup,
          custom_unsubscribe_url: this.opts.unsubscribeGroup
            ? undefined
            : this.opts.unsubscribeUrl,
          list_ids: [this.listId],
          html_content: getHtml({
            unsubscribeUrl: this.opts.unsubscribeUrl,
            content: sendArgs.content
          })
        }
      };
      const [, createCampaignResBody] = await this.client.request(
        createCampaignReq
      );
      const id = createCampaignResBody.id;

      const sendReq = {
        method: "POST",
        url: `/v3/campaigns/${id}/schedules/now`
      };
      const [, sendResBody] = await this.client.request(sendReq);
      return sendResBody.status;
    } catch (e) {
      throw new Error(
        `failed to send campaign: ${JSON.stringify(e.response.body.errors)}`
      );
    }
  }
}
