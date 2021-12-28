// tslint:disable-next-line: no-var-requires
require("dotenv").config();
import mongoose from "mongoose";
import cron from "node-cron";
import getMomentString from "./Utils/DateHelper";
import getAccValue, { verifyBadges } from "./Utils/GetAccValue";

import ManageBadgesService from "./Services/BadgesManagerService";
import ManageAccountsService from "./Services/AccountManagerService";
import DiscordProvider from "./Providers/Discord";
import Repositories from "./Repositories";
import AccountManagerService from "./Services/AccountManagerService";


const manageMarket = async () => {
  try {
    const toneliveData = await Repositories.AccountsRepository.get(
      "bruno.scastro2012@hotmail.com"
    );
    await toneliveData.verifyTokenValidation();
    verifyBadges(toneliveData.email, toneliveData.accessToken);
  } catch (e) {
    console.error("Error on Manage Market", e);
  }
};

const firstVerify = async () => {
  console.log(`${getMomentString()} - Fazendo a primeira verificação`);
  try {
    await ManageBadgesService.searchForNewBadges();

    // await getAccValue("rhulian");
    // await getAccValue("tonelive");
  } catch (e) {
    console.error("Error on first verify", e);
  }
};

const startSchedules = () => {
  // Todos os dias, 1x por hora, no minuto 0 e no minuto 30
  cron.schedule("00 00,30 */1 * * * *", () => {
    console.log(`\n${getMomentString()} - CRON CHAMANDO - Procurar emblemas\n`);
    ManageBadgesService.searchForNewBadges();
  });

  // Todos os dias as 6h da manha e 18h
  cron.schedule("00 00 6,18 * * * *", () => {
    console.log(
      `\n${getMomentString()} - CRON CHAMANDO - Atualizar contas locais\n`
    );
  });
};

const StartBot = async () => {
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

    await ManageAccountsService.LocalAccountUpdater();
    // await AccountManagerService.UpAccountsToMongo();

    // await getAccValue("dekaibr");
    // await AccountManager.UpAccountsToMongo();


    // startSchedules();
    // firstVerify();
    manageMarket();
  } catch (e) {
    console.error(e);
  }
};

// const discordBot = new DiscordProvider();
StartBot();
