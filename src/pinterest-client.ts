import { AxiosInstance, default as axios } from "axios";
import querystring from "querystring";
import tunnel from "tunnel";
import { ISender, SendArgs } from "./sender";

type PinterestOpts = {
  accessToken: string;
  boardName: string;
  username?: string;
  proxyHost?: string;
  proxyPort?: number;
};

export class PinterestClient implements ISender {
  username?: string;
  boardName: string;
  boardId: string;
  axiosInstance: AxiosInstance;

  constructor(opts: PinterestOpts) {
    const { accessToken, boardName, proxyHost, proxyPort, username } = opts;
    this.boardName = boardName;
    this.username = username;
    this.axiosInstance = axios.create({
      baseURL: "https://api.pinterest.com/",
      timeout: 120000,
      validateStatus: status => {
        return status >= 200 && status < 300; // default
      }
    });
    if (proxyHost && proxyPort) {
      this.axiosInstance.defaults.proxy = false;
      this.axiosInstance.defaults.httpsAgent = tunnel.httpsOverHttp({
        proxy: {
          host: proxyHost,
          port: proxyPort
        }
      });
    }
    this.axiosInstance.defaults.headers.post["Content-Type"] =
      "application/x-www-form-urlencoded";
    this.axiosInstance.interceptors.request.use(config => {
      return {
        ...config,
        params: {
          ...config.params,
          access_token: accessToken
        }
      };
    });
  }

  async getUsername(): Promise<void> {
    try {
      const response = await this.axiosInstance.get("/v1/me", {
        params: { fields: "id,username,url" }
      });
      const {
        data: { data }
      } = response;
      this.username = data.username;
    } catch (error) {
      throw new Error(`failed to getUsername: ${error}`);
    }
  }

  async createBoardIfNotExists(): Promise<void> {
    try {
      const {
        data: { data }
      } = await this.axiosInstance.get(
        `/v1/boards/${this.username}/${this.boardName}`
      );
      this.boardId = data.id;
    } catch (error) {
      await this.createBoard();
    }
  }

  async createBoard(): Promise<void> {
    try {
      const {
        data: { data }
      } = await this.axiosInstance.post(
        "/v1/boards/",
        querystring.stringify({ name: this.boardName })
      );
      this.boardId = data.id;
    } catch (error) {
      throw new Error(`failed to createBoard: ${error}`);
    }
  }

  async send(args: SendArgs): Promise<string> {
    if (!this.username) {
      await this.getUsername();
    }
    await this.createBoardIfNotExists();
    if (!this.boardId) {
      throw new Error("board is null");
    }
    try {
      const { content, pinImageUrl, url } = args;
      if (!pinImageUrl) {
        throw new Error("pinImageUrl is null");
      }
      const {
        data: { data }
      } = await this.axiosInstance.post(
        "/v1/pins/",
        querystring.stringify({
          board: `${this.username}/${this.boardName}`,
          note: content,
          link: url,
          image_url: pinImageUrl
        })
      );
      return data.url;
    } catch (error) {
      throw new Error(`failed to create a pin: ${error}`);
    }
  }
}
