// tslint:disable-next-line: no-var-requires
require("dotenv").config();
import axios from "axios";
import moment from "moment";
import Twit from "twit";
import Account from "./Entities/account";

import Repositories from "./Repositories";

const Twitter = new Twit({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_KEY_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
});

const trustedAccounts = ["emblemasdoflow", "flowbadges"];

const tonelive = {
  email: "bruno.scastro2012@hotmail.com",
  refreshToken:
    "AFxQ4_pW17lthI8B6OsBp2VYN-yszncBv73QMlCgF6BFtf-FkQpmw-Wfn9oPNhZBccQkO9ijkLHoS6BlRvJtnuxY0ybduzpbKrfNFv0D4Xn5uu_UBFShq4KJlclBa2HZkzwu8rUsMyTYKB4l-bXepeiaSFR2X40CD0Mp7pQVK7QCuMsPfU_4ZXmUTKmaf_zny9irFFNBb_MCTy94bEDcz42JhtY6L97StQ",
};

const dudu = {
  email: "eduardolima100@gmail.com",
  refreshToken:
    "AFxQ4_qxgFYDgu6n-0mf4-IYjUH4psG7gVXo_zpzbD-QX6DNLE-7I_qyYsLLK3eR3WmadjL-DzAw-1w5GOXotN7qqvp9AY3i_EUtKOq2LuaZfkKBB8XRMyuoiEZFLoeDsNM7gawPnFQhqza5TAhsXqiyi8rLlKKL3juwyYkTVtug6F8BMT-bytOs_Yo17QtB8WUFmCSNTCozEq-qUar60XX9OVFlfAfVeA",
};

const getForAllAcc = (badgeName: string) => {};

const getValidTweets = (tweetList: any[]) => {
  console.log("Tweets List", tweetList);
  const now = moment();
  const validTweets = [];

  for (const tweet of tweetList) {
    const posted = moment(tweet.created_at);
    const diference = moment.duration(now.diff(posted));
    if (diference.asHours() > 24) continue;

    const account = String(tweet.user.screen_name).toLowerCase();
    if (!trustedAccounts.includes(account)) continue;

    const text = String(tweet.text).toLowerCase();

    console.log(text);
    validTweets.push(text);
  }

  return validTweets;
};

const getTweets = async (trustedAccounts: string[]) => {
  const tweetBaseParams = {
    exclude_replies: true,
    count: 10,
  };
  const tweetList = [];
  trustedAccounts.forEach(async (accName: string) => {
    await Twitter.get("statuses/user_timeline", {
      screen_name: accName,
      ...tweetBaseParams,
    })
      .then((response) => {
        tweetList.push(Object.values(response.data)[0]);
      })
      .catch((e) => {
        console.error(
          `Não foi possível obter os dados da conta ${accName}.`,
          e
        );
      });
  });

  return tweetList;
};

const getUsedBadges = async (tweetsList: string[]) => {
  const usedBadges = await Repositories.BadgesRepository.getUsedBadges();
  return usedBadges
};

const getBadgesFromTweets = (tweetsList: string[]) => {
  const badges = [];
  for (const tweet of tweetsList) {
    badges.push(tweet);
  }
  return badges;
};

const searchForNewBadges = async () => {
  const allTweets = await getTweets(trustedAccounts);

  const validTweets = getValidTweets(allTweets);

  const badges = getBadgesFromTweets(validTweets);
};

const tweets = [];
const run = async () => {
  console.log("$$ Rodando o BOT! $$");
  // const ToneTweets = Twitter.stream("statuses/filter", { track: "otonelive" });
  // ToneTweets.on("tweet", function (tweet) {
  //   console.log(tweet);
  // });

  try {
    const tweetWatcher = Twitter.stream("statuses/filter", {
      track: trustedAccounts,
    });

    tweetWatcher.on("tweet", searchForNewBadges);

    // console.log(tweets);
    // console.log(acc.data);

    const tone = new Account(tonelive.email, tonelive.refreshToken);
    const lima = new Account(dudu.email, dudu.refreshToken);

    const accounts = [tone, lima];

    // FlowBadges.on("tweet", manageTweets);

    // lima.getBadge("quintavezdorato");
  } catch (e) {
    console.error(e);
  }
};

run();
