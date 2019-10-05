import { Weibo, WeiboOpts } from "./weibo-sdk/index";
import { ISender, SendArgs } from "./sender";

export class WeiboClient implements ISender {
  readonly client: Weibo;

  constructor(opts: WeiboOpts) {
    this.client = new Weibo(opts);
  }

  async send(args: SendArgs): Promise<string> {
    const title = args.title ? `【${args.title}】` : "";
    const status = title + args.content + args.url;

    this.client.authorize();

    // Todo
    // how to get code from redirect url
    return new Promise(reslove => {
      this.client.OAuth2.access_token(
        {
          code: "bdc30eb50e3a1fb9c344188ec72bd6fa",
          grant_type: "authorization_code"
        },
        (data: any) => {
          this.client.Statuses.share(
            {
              source: this.client.opts.appKey,
              access_token: data.access_token,
              status: encodeURI(`${status} ${this.client.opts.secureDomain}`)
            },
            (resp: any) => {
              if (resp.id) {
                reslove(`https://weibo.com/${resp.user.idstr}/profile`);
              }
              reslove("");
            }
          );
        }
      );
    });
  }
}
