import moment from "moment";
import Twit from "twit";
import constants from "../Constants/Twitter";
import BadgesRepositoryInterface from "../Repositories/Badges/BadgesRepositoryInterface";

export default class TwitterProvider {
  private twitter: Twit;

  constructor(newTweetCallback: VoidFunction) {
    this.twitter = new Twit({
      consumer_key: process.env.TWITTER_API_KEY,
      consumer_secret: process.env.TWITTER_KEY_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      timeout_ms: 60 * 1000,
    });

    const tweetWatcher = this.twitter.stream("statuses/filter", {
      track: constants.trustedAccounts,
    });
    tweetWatcher.on("tweet", newTweetCallback);
  }

  public getValidTweets = (tweetList: any[]) => {
    console.log("Tweets List", tweetList);
    const now = moment();
    const validTweets = [];

    for (const tweet of tweetList) {
      const posted = moment(tweet.created_at);
      const diference = moment.duration(now.diff(posted));
      if (diference.asHours() > 24) continue;

      const account = String(tweet.user.screen_name).toLowerCase();
      if (!constants.trustedAccounts.includes(account)) continue;

      const text = String(tweet.text).toLowerCase();

      console.log(text);
      validTweets.push(text);
    }

    return validTweets;
  };

  public getTweets = async () => {
    const tweetBaseParams = {
      exclude_replies: true,
      count: 10,
    };
    const tweetList = [];
    constants.trustedAccounts.forEach(async (accName: string) => {
      await this.twitter
        .get("statuses/user_timeline", {
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

  public getBadgesFromTweets = (tweetsList: string[]) => {
    console.log('Lista de Tweets', tweetsList)
    const badges = ['ÉTUDOIMPROVISO', 'NATALIECORTEZ', 'CONFORTO', 'BRS2EUA'];
    for (const tweet of tweetsList) {
      badges.push(tweet);
    }
    return badges;
  };
}
