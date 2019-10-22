// @ts-ignore
import Client from "@sendgrid/client/src/classes/client";
import { ISender, SendArgs } from "./sender";

type Opts = {
  sendgridApiKey: string;
  listName: string;
};

type Recipient = {
  email: string;
  firstName?: string;
  lastName?: string;
};

export class SendgridClient implements ISender {
  client: Client;
  opts: Opts;

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
      const lists = body.lists;
      if (lists.find((l: { name: string }) => l.name === this.opts.listName)) {
        return;
      }
    } catch (e) {
      try {
        const request = {
          method: "POST",
          url: `/v3/contactdb/lists`,
          body: {
            name: this.opts.listName
          }
        };
        await this.client.request(request);
      } catch (e) {
        window.console.error(`failed to createList: ${e.response.body.errors}`);
      }
    }
  }

  async addToList(recipient: Recipient): Promise<void> {
    // https://sendgrid.com/docs/API_Reference/Web_API_v3/Marketing_Campaigns/contactdb.html#Add-Single-Recipient-POST
    // https://sendgrid.com/docs/API_Reference/Web_API_v3/Marketing_Campaigns/contactdb.html#Add-a-Single-Recipient-to-a-List-POST
    window.console.log(recipient);

    return;
  }

  async send(sendArgs: SendArgs): Promise<string | boolean> {
    // https://sendgrid.com/docs/API_Reference/Web_API_v3/Marketing_Campaigns/campaigns.html#Send-a-Campaign-POST
    window.console.log(sendArgs);
    return "";
  }
}
