// @ts-ignore
import mailer from "nodemailer";
// @ts-ignore
import mg from "nodemailer-mailgun-transport";
import { ISender, SendArgs } from "./sender";

type MailgunOpts = {
  apiKey: string;
  domain: string;

  from: string; // `"${t("meta.title")}" <noreply@${this.config.mailgun.domain}>`
  subscriberEmails: Array<string>;
};

export class Mailgun implements ISender {
  public opts: MailgunOpts;
  public transporter: mailer.Transporter;

  constructor(opts: MailgunOpts) {
    this.opts = opts;
    this.transporter = mailer.createTransport(
      mg({
        auth: {
          api_key: opts.apiKey,
          domain: opts.domain
        }
      })
    );
  }

  public async send(sendArgs: SendArgs): Promise<string> {
    for (const email of this.opts.subscriberEmails) {
      await this.transporter.sendMail({
        from: this.opts.from,
        to: email,
        subject: sendArgs.title,
        html: sendArgs.content
      });
    }
    return "";
  }
}
