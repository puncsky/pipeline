import axios from "axios";
import { ISender, SendArgs } from "./sender";
import querystring from "querystring";

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
    console.log(response);
    return response.data;
  }
}
