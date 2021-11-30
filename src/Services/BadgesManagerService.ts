import moment from "moment";
import FlowProvider from "../Providers/Platform";
import TwitterProvider from "../Providers/Twitter";
import Repositories from "../Repositories";
import { BadgeData } from "../Repositories/Badges/BadgesRepositoryInterface";
import getMomentString from "../Utils/DateHelper";

const searchForNewBadges = async () => {
  console.log(
    `${getMomentString()} - Começando uma nova verificação de badges`
  );

  try {
    const allTweets = await TwitterInstance.getTweets();

    const validTweets = TwitterInstance.getValidTweets(allTweets);

    const badgesFromTweets = TwitterInstance.getBadgesFromTweets(validTweets);

    const badgesFromProfiles = await PlatformInstance.getBadgesFromProfiles();

    const allBadges = badgesFromTweets.concat(badgesFromProfiles);

    const newBadges = [...new Set(allBadges)];

    newBadges.length > 0
      ? console.log(
          `\n${getMomentString()} - Foram encontradas ${
            newBadges.length
          } novas badges. \nLista de badges: ${newBadges}\n`
        )
      : console.log(
          `\n${getMomentString()} - Ainda não temos nenhuma nova badge!`
        );

    await pickBadgesForAllAccounts(newBadges);

    console.log(`${getMomentString()} - Processo de resgate finalizado!`);
  } catch (err) {
    console.log(`Erro ao tentar resgatar emblemas.`, err);
  }
};

const TwitterInstance = new TwitterProvider(searchForNewBadges);
const PlatformInstance = new FlowProvider();

const addNewBadge = async (badge: string): Promise<string> => {
  try {
    const badgeData: BadgeData = {
      name: badge,
      expirationDate: moment().add(24, "hours").toDate(),
    };
    const badgeName = await Repositories.BadgesRepository.addBadge(badgeData);

    return badgeName;
  } catch (error) {
    console.log("Erro:", error);
  }
};

const pickBadgesForAllAccounts = async (badges: string[]) => {
  const accounts = await Repositories.AccountsRepository.getAll();
  for (const badge of badges) {
    await addNewBadge(badge);
    for (const account of accounts) {
      const alreadyHave = await account.alreadyHaveBadge(badge);
      if (alreadyHave) continue;

      await account.pickBadge(badge);
      await Repositories.AccountsRepository.set(account);
    }
  }
};

export default {
  searchForNewBadges,
};
