// @ts-ignore
import Client from "@sendgrid/client/src/classes/client";
import { ISender, SendArgs } from "./sender";

type Opts = {
  sendgridApiKey: string;
  listName: string;
};

type Recipient = {
  email: string;
  lastName?: string;
  pet?: string;
  age?: number;
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
      throw new Error(`failed to createList: ${e.response.body.errors}`);
    }
  }

  async addToList(recipient: Recipient): Promise<void> {
    if (!this.listId) {
      await this.createListIfNotExists();
    }
    try {
      const addRecipientReq = {
        method: "POST",
        url: `/v3/contactdb/recipients`,
        body: [
          {
            email: recipient.email,
            last_name: recipient.lastName,
            pet: recipient.pet,
            age: recipient.age
          }
        ]
      };
      const [, addRecipientResBody] = await this.client.request(
        addRecipientReq
      );
      const recipientId = addRecipientResBody.persisted_recipients[0];

      const addListReq = {
        method: "POST",
        url: `/v3/contactdb/lists/${this.listId}/recipients/${recipientId}`
      };
      await this.client.request(addListReq);
    } catch (e) {
      throw new Error(`failed to addToList: ${e.response.body.errors}`);
    }
  }

  async send(sendArgs: SendArgs): Promise<string | boolean> {
    if (!this.listId) {
      await this.createListIfNotExists();
    }
    try {
      const createCampaignReq = {
        method: "POST",
        url: `/v3/campaigns`,
        body: [
          {
            title: sendArgs.title,
            list_ids: [this.listId],
            //html_content: sendArgs.content,
            plain_content: sendArgs.content
          }
        ]
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
      throw new Error(`failed to send campaign: ${e.response.body.errors}`);
    }
  }
}
