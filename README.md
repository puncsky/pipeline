[![CircleCI](https://circleci.com/gh/puncsky/typescript-starter.svg?style=svg)](https://circleci.com/gh/puncsky/typescript-starter)

# Pipeline: publishing posts to social networks and chatbots

Purposes:

- User Acquisition
- SEO

A simplistic typescript boilerplate using babel, tslint, ava, and CircleCI.

```bash
nvm use 10.15.1
npm install

# test
# run all tests
npm run test
# run a single test file
npm run ava ./path/to/test-file.js
```

### Twitter

Get your credentials from [Twitter Developer](https://developer.twitter.com/en/application).

```text
consumerKey TODO,
consumerSecret: TODO,
accessTokenKey: TODO,
accessTokenSecret: TODO
```

### Telegram

Get your bot token from [BotFather](https://telegram.me/botfather).

```text
botToken: TODO,
channelId: TODO
```

### Pinterest

Get your access token from [Pinterest Developers](https://developers.pinterest.com/docs/api/overview/)

```text
access_token: TODO
```

## Scripts

To run a single test case, follow instructions [here](https://github.com/avajs/ava/blob/master/docs/01-writing-tests.md#running-specific-tests).

- `npm run build`: build source code from `src` to `dist`
- `npm publish`: publish code to npm
- `npm run changelog-patch` bump version patch (bug fixes)
- `npm run changelog-minor` bump version minor (new features)
- `npm run changelog-major` bump version major (breaking change)
