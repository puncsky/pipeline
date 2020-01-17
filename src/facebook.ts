import axios from "axios";
import querystring from "querystring";
import { ISender, SendArgs } from "./sender";

type FacebookOpts = {
  accessToken: string;
  groupId: string;
};

export class FacebookClient implements ISender {
  opts: FacebookOpts;

  constructor(opts: FacebookOpts) {
    this.opts = opts;
  }

  async send(sendArgs: SendArgs): Promise<string> {
    const response = await axios.post(
      `https://graph.facebook.com/${this.opts.groupId}/feed`,
      querystring.stringify({
        access_token: this.opts.accessToken,
        message: sendArgs.content
      }),
      {
        headers: [{ "Content-Type": "application/x-www-form-urlencoded" }]
      }
    );
    return response.data;
  }
}
