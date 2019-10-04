import Telegraf, { ContextMessageUpdate } from "telegraf";
import { ISender, SendArgs } from "./sender";

type TelegramOpts = {
  botToken: string;
  channelId: string;
};

export class TelegramClient implements ISender {
  bot: Telegraf<ContextMessageUpdate>;
  opts: TelegramOpts;

  constructor(opts: TelegramOpts) {
    this.bot = new Telegraf<ContextMessageUpdate>(opts.botToken);
    this.opts = opts;
  }

  async send(sendArgs: SendArgs): Promise<string> {
    const fullText = `${
      sendArgs.title ? `[${sendArgs.title}](${sendArgs.url})` : ""
    }

${sendArgs.content}
    `;
    const sent = await this.bot.telegram.sendMessage(
      this.opts.channelId,
      fullText,
      { parse_mode: "Markdown" }
    );
    return `https://t.me/${sent.chat.username}/${sent.message_id}`;
  }
}
