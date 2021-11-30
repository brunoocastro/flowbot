import moment from "moment";
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

    // const allBadges = badgesFromTweets.concat(badgesFromProfiles);

    // const uniqueBadges = [...new Set(allBadges)];

    const newBadges = await filterNewBadges(badgesFromTweets);

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
      await account.pickBadge(badge);
      await Repositories.AccountsRepository.set(account);
    }
  }
};

const filterNewBadges = async (badgesList: string[]) => {
  const newBadges = [];
  for (const badge of badgesList) {
    const cleanBadge = String(badge).toLowerCase();
    const exists = await Repositories.BadgesRepository.isExistentBadge(
      cleanBadge
    );
    // const exists = false
    if (exists || newBadges.includes(cleanBadge)) continue;
    newBadges.push(cleanBadge);
  }
  return newBadges;
};


export default {
  searchForNewBadges
}