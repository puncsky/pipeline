import { AxiosInstance, default as axios } from "axios";
import open from "open";
import querystring from "querystring";
import { ISender, SendArgs } from "./sender";

type WeiboOpts = {
  appKey: string;
  appSecret: string;
  redirectUrl: string;
  authorizationCode: string;
  authorizationExpired: boolean;
  accessToken: string;
};

export class WeiboClient implements ISender {
  readonly opts: WeiboOpts;
  axiosInstance: AxiosInstance;

  constructor(opts: WeiboOpts) {
    this.opts = opts;
    this.axiosInstance = axios.create({
      baseURL: "https://api.weibo.com/",
      timeout: 120000,
      validateStatus: status => {
        return status >= 200 && status < 300; // default
      }
    });
    this.axiosInstance.defaults.headers.post["Content-Type"] =
      "application/x-www-form-urlencoded";
    this.axiosInstance.interceptors.request.use(config => {
      if (config.method === "post") {
        return {
          ...config,
          data: querystring.stringify({
            ...config.data,
            access_token: opts.accessToken
          })
        };
      }
      return config;
    });
    this.axiosInstance.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        let errorMsg = "";
        if (error.response) {
          errorMsg = `error status: [${
            error.response.status
          }], error data: [${JSON.stringify(error.response.data)}]`;
        } else if (error.request) {
          errorMsg = error.request;
        } else {
          errorMsg = error.message;
        }
        return Promise.reject(errorMsg);
      }
    );
  }

  validateAccessToken = async () => {
    try {
      const {
        data: { expire_in }
      } = await this.axiosInstance.post("/oauth2/get_token_info");
      return expire_in >= 60;
    } catch (error) {
      console.warn(`failed to validate access_token: [${error}].`);
      return false;
    }
  };

  authorize = async () => {
    const { appKey, redirectUrl } = this.opts;
    const path = `https://api.weibo.com/oauth2/authorize?client_id=${appKey}&redirect_uri=${redirectUrl}`;
    await open(path, { wait: true });
    return true;
  };

  getAccessToken = async () => {
    try {
      const { appKey, appSecret, authorizationCode, redirectUrl } = this.opts;
      const {
        data: { access_token }
      } = await this.axiosInstance.post("/oauth2/access_token", {
        client_id: appKey,
        grant_type: "authorization_code",
        code: authorizationCode,
        redirect_uri: redirectUrl,
        client_secret: appSecret
      });
      console.warn(
        `the new access_token is: [${access_token}], please update .env file`
      );
      return access_token;
    } catch (error) {
      throw new Error(`failed to get access_token: [${error}].`);
    }
  };

  share = async (sendArgs: SendArgs) => {
    const { url, content } = sendArgs;
    try {
      const response = await this.axiosInstance.post("/statuses/share.json", {
        status: encodeURI(`${url}?query=${content}`)
      });
      const {
        data: { id }
      } = response;
      return id;
    } catch (error) {
      throw new Error(`failed to share: [${error}].`);
    }
  };

  send(sendArgs: SendArgs): Promise<string | boolean> {
    // 1. 判断 access_token 有效性
    // 2. 有效，直接发送
    // 3. 无效，打开浏览器窗口；并提示用户更新 AUTHORIZATION_CODE 和 AUTHORIZATION_EXPIRED=true 后重试
    // 4. 重试流程：
    // 4.1 判断 access_token 是否有效，必然会无效
    // 4.2 无效后，判断 expired === true
    // 4.3 使用新的 authorizationCode 获取新的 access_token 并打印出来，并提示更新到 .env 文件中，同时更新 AUTHORIZATION_EXPIRED=false
    console.log(sendArgs);
    throw new Error("Method not implemented.");
  }
}
