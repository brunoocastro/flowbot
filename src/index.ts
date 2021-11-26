// tslint:disable-next-line: no-var-requires
require("dotenv").config();
import mongoose from "mongoose";
import TwitterProvider from "./Providers/Twitter";
import Repositories from "./Repositories";
import cron from "node-cron";
import FlowProvider from "./Providers/Platform";
import getMomentString from "./Utils/DateHelper";
import getAccValue from "./Utils/GetAccValue";

import ManageBadgesService from "./Services/BadgesManagerService";
import AccountManager from "./Services/AccountManagerService";

const badgesManager = new ManageBadgesService();

const pickBadgesForAllAccounts = async (badges: string[]) => {
  const accounts = await Repositories.AccountsRepository.getAll();
  for (const badge of badges) {
    await badgesManager.addNewBadge(badge);
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
    if (exists || newBadges.includes(cleanBadge)) continue;
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

const run = async () => {
  console.log(`${getMomentString()} - $$ BOT DUS GURI ONLINE $$`);
  try {
    if (!process.env.MONGO_URL)
      throw new Error("MongoDB Server not initialized");

    await mongoose
      .connect(process.env.MONGO_URL)
      .then(() => console.log(`${getMomentString()} - Conectado com o MongoDB`))
      .catch((e) =>
        console.log(`${getMomentString()} - Erro ao conectar com o MongoDB`, e)
      );
    // await getAccValue('tonelive');
    // await getAccValue('gui_aguiar_');
    // await AccountManager.UpAccountsToMongo();
    await AccountManager.LocalAccountUpdater();
    await searchForNewBadges();
  } catch (e) {
    console.error(e);
  }

  // Todos os dias, 1x por hora, no minuto 0 e no minuto 30
  cron.schedule("00 00,30 */1 * * * *", () => {
    console.log(`${getMomentString()} - CRON CHAMANDO - Procurar emblemas`);
    searchForNewBadges();
  });

  // Todos os dias as 6h da manha e 18h
  cron.schedule("00 00 6,18 * * * *", () => {
    console.log(
      `${getMomentString()} - CRON CHAMANDO - Atualizar contas locais`
    );
    AccountManager.LocalAccountUpdater();
  });
};

run();
