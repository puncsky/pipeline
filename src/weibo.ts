import { AxiosInstance, default as axios } from "axios";
import open from "open";
import querystring from "querystring";
import { ISender, SendArgs } from "./sender";
import { generateImageAndSend } from "./text-to-image/generate";

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
            access_token: opts.accessToken,
            ...config.data
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
      return expire_in >= 60; // seconds
    } catch (error) {
      console.warn(`failed to validate access_token: [${error}].`);
      return false;
    }
  };

  authorize = async () => {
    const { appKey, redirectUrl } = this.opts;
    const path = `https://api.weibo.com/oauth2/authorize?client_id=${appKey}&redirect_uri=${redirectUrl}`;
    await open(path);
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
        `The new access_token is: [${access_token}], please update the WEIBO_ACCESS_TOKEN field in the .env file and update WEIBO_AUTHORIZATION_EXPIRED to false.`
      );
      return access_token;
    } catch (error) {
      throw new Error(`failed to get access_token: [${error}].`);
    }
  };

  share = async (sendArgs: SendArgs, accessToken: string) => {
    const { url = "", content, generateTextImage } = sendArgs;
    try {
      let response;
      const formData = {
        status: `${content}${encodeURI(url)}`,
        access_token: accessToken
      };
      if (generateTextImage) {
        const opts = {
          formData,
          imageFieldKey: "pic",
          imageText: content,
          uploadUrl: "https://api.weibo.com/statuses/share.json"
        };
        response = await generateImageAndSend(opts);
      } else {
        response = await this.axiosInstance.post(
          "/statuses/share.json",
          formData
        );
      }
      const {
        data: {
          user: { idstr }
        }
      } = response;
      // share link address
      return `https://weibo.com/${idstr}/profile`;
    } catch (error) {
      throw new Error(`failed to share: [${error}].`);
    }
  };

  send = async (sendArgs: SendArgs): Promise<string | boolean> => {
    const isValid = await this.validateAccessToken();
    if (isValid) {
      return this.share(sendArgs, this.opts.accessToken);
    } else {
      const { authorizationExpired } = this.opts;
      if (!authorizationExpired) {
        this.authorize();
        console.warn(
          "The program will open the browser, please log in to Weibo and copy the code parameter in the redirected address, then update the WEIBO_AUTHORIZATION_CODE field in the .env file and update WEIBO_AUTHORIZATION_EXPIRED to true. Then please try again."
        );
        return false;
      } else {
        const newAccessToken = await this.getAccessToken();
        return this.share(sendArgs, newAccessToken);
      }
    }
  };
}
