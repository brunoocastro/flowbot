// tslint:disable-next-line: no-var-requires
require("dotenv").config();
import axios from "axios";
import moment from "moment";
import Account from "./Entities/account";
import TwitterProvider from "./Providers/Twitter";
import Repositories from "./Repositories";
import getAccValue from "./Utils/GetAccValue";
import cron from "node-cron";

const tonelive = {
  email: "bruno.scastro2012@hotmail.com",
  username: "tonelive",
  refreshToken:
    "AFxQ4_oPtCFHUNXE8sPZY0PwgY1H25fiWNvre1cnzbDE45O5vOyUwFTZzo_iL_I_c1aLtmhVcNxTSz0v6qrJoNuYEPmMM6qhYgpqbzJXTkfhpYjzQheoV1oino5b0ljr1XWS5scea_yyzsoz1X3NwpXItWIXWUhrcPl7M_kf7DAGhke8lDehKXpzigXqnf4m0gtJhhWnmRm1ezEAaJq7x9j_2zRodf_vqQ",
};

const dudu = {
  email: "eduardolima100@gmail.com",
  username: "eduardolima100",
  refreshToken:
    "AFxQ4_qxgFYDgu6n-0mf4-IYjUH4psG7gVXo_zpzbD-QX6DNLE-7I_qyYsLLK3eR3WmadjL-DzAw-1w5GOXotN7qqvp9AY3i_EUtKOq2LuaZfkKBB8XRMyuoiEZFLoeDsNM7gawPnFQhqza5TAhsXqiyi8rLlKKL3juwyYkTVtug6F8BMT-bytOs_Yo17QtB8WUFmCSNTCozEq-qUar60XX9OVFlfAfVeA",
};

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
    if (usedBadges.includes(cleanBadge)) continue;
    newBadges.push(cleanBadge);
  }
  return newBadges;
};

const searchForNewBadges = async () => {
  console.log(
    `${moment("DD.MM.YYYY HH:mm")} - Começando uma nova verificação de badges`
  );
  const allTweets = await TwitterInstance.getTweets();

  const validTweets = TwitterInstance.getValidTweets(allTweets);

  const badgesFromTweets = TwitterInstance.getBadgesFromTweets(validTweets);

  const newBadges = await filterNewBadges(badgesFromTweets);
  console.log(
    `${moment("DD.MM.YYYY HH:mm")} - Foram encontradas ${
      newBadges.length
    } novas badges. \nLista de badges:`,
    newBadges
  );

  await pickBadgesForAllAccounts(newBadges);

  console.log(
    `${moment("DD.MM.YYYY HH:mm")} - Processo de resgate finalizado!`
  );
};

const TwitterInstance = new TwitterProvider(searchForNewBadges);

const run = async () => {
  console.log(`$$ ${moment("DD.MM.YYYY HH:mm")} - BOT DUS GURI ONLINE $$`);
  try {
    const tone = new Account(
      tonelive.email,
      tonelive.username,
      tonelive.refreshToken
    );
    const lima = new Account(dudu.email, dudu.username, dudu.refreshToken);

    await Repositories.AccountsRepository.set(tone);
    await Repositories.AccountsRepository.set(lima);

    // await getAccValue(tone);
    // await getAccValue(lima);
    // await getAccValue('bahamut');

    searchForNewBadges();
  } catch (e) {
    console.error(e);
  }

  cron.schedule("00 01,13 * * *", () => {
    searchForNewBadges();
  });
};

run();
