import Twitter from "twitter";
import { ISender, SendArgs } from "./sender";

type TwitterOpts = {
  consumerKey: string;
  consumerSecret: string;
  accessTokenKey: string;
  accessTokenSecret: string;
};

export class TwitterClient implements ISender {
  readonly client: Twitter;

  constructor(opts: TwitterOpts) {
    this.client = new Twitter({
      consumer_key: opts.consumerKey,
      consumer_secret: opts.consumerSecret,
      access_token_key: opts.accessTokenKey,
      access_token_secret: opts.accessTokenSecret
    });
  }

  async send(args: SendArgs): Promise<string> {
    const title = args.title ? `【${args.title}】` : "";
    const status = title + args.content + args.url;
    const resp = await this.client.post("statuses/update", { status });
    return `https://twitter.com/guigu_io/status/${resp.id}`;
  }
}
