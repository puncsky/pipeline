import dotenv from "dotenv";

dotenv.config();
import test from "ava";
import { TwitterClient } from "../twitter";

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
