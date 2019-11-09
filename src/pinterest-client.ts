import request from "request";
import { ISender, SendArgs } from "./sender";

type PinterestOpts = {
  accessToken: string;
  boardName: string;
  username?: string;
  proxyUrl?: string;
};

type BaseParams = {
  access_token: string;
  fields?: string;
};

type BaseOptions = {
  method: string;
  url: string;
  qs?: BaseParams;
  // use vpn
  proxy?: string;
  headers?: object;
  form?: object;
};

const baseUrl = "https://api.pinterest.com";

// tslint:disable-next-line: no-any
const baseRequest = (options: BaseOptions): any => {
  return new Promise((resolve, reject) => {
    request(
      options,
      // tslint:disable-next-line: no-any
      (error: any, response: { statusCode: number }, body: any) => {
        if (error) {
          return reject(error);
        }
        if (
          response &&
          (response.statusCode !== 200 && response.statusCode !== 201)
        ) {
          return reject(body);
        }
        return resolve(JSON.parse(body));
      }
    );
  });
};

export class PinterestClient implements ISender {
  username?: string;
  boardName: string;
  boardId: string;
  accessToken: string;
  proxyUrl?: string;

  constructor(opts: PinterestOpts) {
    const { accessToken, boardName, proxyUrl, username } = opts;
    this.accessToken = accessToken;
    this.proxyUrl = proxyUrl;
    this.boardName = boardName;
    this.username = username;
  }

  async getUsername(): Promise<void> {
    const param = {
      access_token: this.accessToken,
      fields: "id,username,url"
    };
    const options = {
      url: `${baseUrl}/v1/me`,
      method: "GET",
      qs: param,
      proxy: this.proxyUrl
    };
    try {
      const { data } = await baseRequest(options);
      this.username = data.username;
    } catch (error) {
      throw new Error(`failed to getUsername: ${JSON.stringify(error)}`);
    }
  }

  async createBoardIfNotExists(): Promise<void> {
    const param = {
      access_token: this.accessToken
    };
    const options = {
      url: `${baseUrl}/v1/boards/${this.username}/${this.boardName}`,
      method: "GET",
      qs: param,
      proxy: this.proxyUrl
    };
    try {
      const { data } = await baseRequest(options);
      this.boardId = data.id;
    } catch (error) {
      await this.createBoard();
    }
  }

  async createBoard(): Promise<void> {
    try {
      const param = {
        access_token: this.accessToken
      };
      const options = {
        url: `${baseUrl}/v1/boards/`,
        method: "POST",
        qs: param,
        proxy: this.proxyUrl,
        form: {
          name: this.boardName
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      };
      const { data } = await baseRequest(options);
      this.boardId = data.id;
    } catch (error) {
      throw new Error(`failed to createBoard: ${JSON.stringify(error)}`);
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
      const param = {
        access_token: this.accessToken
      };
      const options = {
        url: `${baseUrl}/v1/pins/`,
        method: "POST",
        qs: param,
        proxy: this.proxyUrl,
        form: {
          board: `${this.username}/${this.boardName}`,
          note: content,
          link: url,
          image_url: pinImageUrl
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      };
      const { data } = await baseRequest(options);
      return data.url;
    } catch (error) {
      throw new Error(`failed to create a pin: ${JSON.stringify(error)}`);
    }
  }
}
