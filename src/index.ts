// tslint:disable-next-line: no-var-requires
require("dotenv").config();
import axios from "axios";
import moment from "moment";
import Account from "./Entities/Account";
import TwitterProvider from "./Providers/Twitter";
import Repositories from "./Repositories";
import getAccValue from "./Utils/GetAccValue";
import cron from "node-cron";
import FlowProvider from "./Providers/Platform";
import getMomentString from "./Utils/DateHelper";
import AccountCreator from "./Utils/AccountCreator";

const pickBadgesForAllAccounts = async (badges: string[]) => {
  const accounts = await Repositories.AccountsRepository.getAll();
  const usedBadges = await Repositories.BadgesRepository.getUsedBadges();
  for (const badge of badges) {
    if (usedBadges.includes(badge)) continue;
    for (const account of accounts) {
      await account.pickBadge(badge);
      await Repositories.AccountsRepository.set(account);
    }
    await Repositories.BadgesRepository.addBadge(badge);
  }
};

const filterNewBadges = async (badgesList: string[]) => {
  const usedBadges = await Repositories.BadgesRepository.getUsedBadges();
  const newBadges = [];
  for (const badge of badgesList) {
    const cleanBadge = String(badge).toLowerCase();
    if (usedBadges.includes(cleanBadge) || newBadges.includes(cleanBadge))
      continue;
    newBadges.push(cleanBadge);
  }
  return newBadges;
};

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

    const uniqueBadges = [...new Set(allBadges)];

    const newBadges = await filterNewBadges(uniqueBadges);
    console.log(
      `\n${getMomentString()} - Foram encontradas ${
        newBadges.length
      } novas badges. \nLista de badges: ${newBadges}\n`
    );

    await pickBadgesForAllAccounts(newBadges);

    console.log(`${getMomentString()} - Processo de resgate finalizado!`);
  } catch (err) {
    console.log(`Erro ao tentar resgatar emblemas.`, err);
  }
};

const TwitterInstance = new TwitterProvider(searchForNewBadges);
const PlatformInstance = new FlowProvider();

const run = async () => {
  console.log(`${getMomentString()} - $$ BOT DUS GURI ONLINE $$`);
  try {
    // await getAccValue('dimi_');
    // await getAccValue('gui_aguiar_');
    await AccountCreator();
    await searchForNewBadges();
  } catch (e) {
    console.error(e);
  }

  cron.schedule("00 00,06,12,18 * * *", () => {
    console.log(`${getMomentString()} - CRON CHAMANDO`);
    searchForNewBadges();
  });
};

run();
