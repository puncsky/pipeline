import PinterestAPI from "pinterest-node-api";
import { ISender, SendArgs } from "./sender";

export class PinterestClient implements ISender {
  readonly client: PinterestAPI;
  username: string;
  boardName: string;
  boardId: string;

  constructor(accessToken: string, boardName: string) {
    this.client = new PinterestAPI(accessToken);
    this.boardName = boardName;
    this.getUsername();
  }

  async getUsername(): Promise<void> {
    const param = {
      fields: "id,username,url"
    };
    try {
      const { data } = await this.client.users.getUserOwnInfo(param);
      this.username = data.username;
    } catch (error) {
      throw new Error(`failed to getUsername: ${JSON.stringify(error)}`);
    }
  }

  async createBoardIfNotExists(): Promise<void> {
    try {
      const { data } = await this.client.boards.getBoard(
        `${this.username}/${this.boardName}`
      );
      this.boardId = data.id;
    } catch (error) {
      this.createBoard();
    }
  }

  async createBoard(): Promise<void> {
    try {
      const param = {
        name: this.boardName
      };
      const { data } = await this.client.boards.createBoard(param);
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
        board: `${this.username}/${this.boardName}`,
        note: content,
        link: url,
        image_url: pinImageUrl
      };
      const { data } = await this.client.pins.createPin(param);
      return data.url;
    } catch (error) {
      throw new Error(`failed to create a pin: ${JSON.stringify(error)}`);
    }
  }
}
