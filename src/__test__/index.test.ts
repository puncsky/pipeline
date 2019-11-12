import test from "ava";
import dotenv from "dotenv";
import { FacebookClient } from "../facebook";
import { PinterestClient } from "../pinterest-client";
import { SendgridClient } from "../sendgrid-client";
import { TelegramClient } from "../telegram";
import { TwitterClient } from "../twitter";

dotenv.config();

const SENDGRID_OPTS = {
  sendgridApiKey: String(process.env.SENDGRID_API_KEY),
  listName: String(process.env.SENDGRID_LIST_NAME),
  senderId: String(process.env.SENDGRID_SENDER_ID),
  unsubscribeUrl: String(process.env.SENDGRID_UNSUBSCRIBE_URL),
  unsubscribeGroup: Number(process.env.SENDGRID_UNSUBSCRIBE_GROUP)
};

const FACEBOOK_OPTS = {
  accessToken: String(process.env.FACEBOOK_ACCESS_TOKEN),
  groupId: "554611227955614"
};

test.skip("tweet", async t => {
  const twitter = new TwitterClient({
    consumerKey: String(process.env.TWITTER_CONSUMER_KEY),
    consumerSecret: String(process.env.TWITTER_CONSUMER_SECRET),
    accessTokenKey: String(process.env.TWITTER_ACCESS_TOKEN_KEY),
    accessTokenSecret: String(process.env.TWITTER_ACCESS_TOKEN_SECRET)
  });
  const url = await twitter.send({
    url: "https://guigu.io/notes/176-lyft-marketing-automation-symphony",
    title: "title",
    content: "comments"
  });
  t.truthy(url.startsWith("https://twitter.com/guigu_io/status/"));
});

test.skip("telegram channel", async t => {
  const telegram = new TelegramClient({
    botToken: String(process.env.TELEGRAM_BOT_TOKEN),
    channelId: String(process.env.TELEGRAM_CHANNEL_ID)
  });
  const url = await telegram.send({
    title: "title",
    url: "https://iotex.io",
    content: "[hello world](https://google.com)"
  });
  t.truthy(url.startsWith("https://t.me/"));
});

test.skip("sendgrid campaign channel", async t => {
  const sendgrid = new SendgridClient(SENDGRID_OPTS);
  t.notThrows(async () => {
    await sendgrid.createListIfNotExists();
  });
});

test.skip("sendgrid add to list", async t => {
  const sendgrid = new SendgridClient(SENDGRID_OPTS);
  await sendgrid.addToList({
    email: "test@iotex.io",
    lastName: "iotex_test"
  });

  t.truthy(sendgrid.listId);
});

test.skip("sendgrid send campaign", async t => {
  const sendgrid = new SendgridClient(SENDGRID_OPTS);
  await sendgrid.addToList({
    email: "puncsky@gmail.com"
  });
  await sendgrid.getUnsubscribeGroups();
  const status = await sendgrid.send({
    title: "22 iotex campaign test 2",
    content: "this is a test"
  });
  console.log(status);
  t.truthy(status);
});

test.skip("pinterest create a pin", async t => {
  const pinterest = new PinterestClient({
    accessToken: String(process.env.PINTEREST_ACCESS_TOKEN),
    boardName: "test-create-pin-02",
    // tslint:disable-next-line: no-http-string
    proxyHost: "127.0.0.1",
    proxyPort: 10887
  });
  const url = await pinterest.send({
    content: "test creat a pin 01",
    pinImageUrl:
      "https://pbs.twimg.com/media/EIzsz8zUYAAeIq9?format=jpg&name=900x900",
    url: "https://twitter.com/1994Yuangu"
  });
  t.truthy(url.startsWith("https://www.pinterest.com/pin"));
});

test.skip("facebook send group message", async t => {
  const facebook = new FacebookClient(FACEBOOK_OPTS);

  const response = await facebook.send({
    content: "this is a test"
  });
  t.truthy(response);
});
