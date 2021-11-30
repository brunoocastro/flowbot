import moment from "moment";
import Twit from "twit";
import { isNotEmittedStatement } from "typescript";
import constants from "../Constants/Twitter";
import BadgesRepositoryInterface from "../Repositories/Badges/BadgesRepositoryInterface";
import getMomentString from "../Utils/DateHelper";

export default class TwitterProvider {
  private twitter: Twit;

  getBadgeText = {
    embflow: (text: string): string => {
      const regex = new RegExp(
        /(: )([a-z|à-ú|0-9|!@#$%¨&*(){}<>,.;:/|\\ªº§]+)/g
      );
      const splitLines = text.split("\n");
      const line = splitLines[0];
      const lineRegex = line.match(regex);
      if (lineRegex) {
        const badgeWithPoints = line.match(regex)[0];
        const badge = badgeWithPoints.substring(2);
        return badge;
      }
      return null;
    },
  };

  constructor(newTweetCallback: VoidFunction) {
    this.twitter = new Twit({
      consumer_key: process.env.TWITTER_API_KEY,
      consumer_secret: process.env.TWITTER_KEY_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      timeout_ms: 60 * 1000,
    });

    this.startTweetWatcher(newTweetCallback);
  }

  private startTweetWatcher = async (newTweetCallback: VoidFunction) => {
    console.log(
      `${getMomentString()} - Analisando em tempo real os tweets das contas ${
        constants.possibleBadgePost
      }`
    );
    const possibleBadgeIds = await this.getAccountsIds(
      constants.possibleBadgePost
    );

    const tweetWatcher = this.twitter.stream("statuses/filter", {
      follow: possibleBadgeIds,
    });

    tweetWatcher.on("tweet", (tweet) => {
      console.log(
        `${getMomentString()} - Novo Tweet de uma conta confiável -> ${
          tweet.user.screen_name
        }`
      );
      newTweetCallback();
    });
  };

  private getAccountsIds = async (AccList: string[]) => {
    const IDList = [];
    for (const accName of AccList) {
      const params = {
        screen_name: accName,
        include_entities: false,
      };
      await this.twitter
        .get("users/show", params)
        .then((response: any) => {
          IDList.push(Number(response.data.id));
        })
        .catch((e) => {
          console.error(
            `Não foi possível obter o id do twitter ${accName}.`,
            e
          );
        });
    }
    return IDList;
  };

  public getValidTweets = (tweetList: any[]) => {
    const now = moment();
    const validTweets = {};

    for (const tweet of tweetList) {
      const posted = moment(new Date(tweet.created_at));
      const diference = moment.duration(now.diff(posted));
      if (diference.asHours() > 24) continue;
      const account = String(tweet.user.screen_name).toLowerCase();
      if (!constants.trustedAccounts.includes(account)) continue;

      const text = String(tweet.text).toLowerCase();

      if (!validTweets[account]) validTweets[account] = [];

      validTweets[account].push(text);
    }

    return validTweets;
  };

  public getTweets = async () => {
    const tweetBaseParams = {
      exclude_replies: true,
      count: 7,
      lang: "pt",
    };
    const tweetList = [];
    for (const accName of constants.trustedAccounts) {
      console.log(
        `${getMomentString()} - Buscando tweets no perfil @${accName}`
      );
      const params = {
        screen_name: accName,
        ...tweetBaseParams,
      };
      await this.twitter
        .get("statuses/user_timeline", params)
        .then((response) => {
          Object.values(response.data).forEach((item) => {
            tweetList.push(item);
          });
        })
        .catch((e) => {
          console.error(
            `Não foi possível obter os dados do twitter ${accName}.`,
            e
          );
        });
    }

    return tweetList;
  };

  public getBadgesFromTweets = (tweetsList: { [key: string]: string[] }) => {
    const badges = [];
    for (const account of Object.keys(tweetsList)) {
      for (const tweet of tweetsList[account]) {
        const badge = this.getBadgeText[account](tweet);
        if (badge) badges.push(badge);
      }
    }
    return badges;
  };
}
