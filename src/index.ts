// tslint:disable-next-line: no-var-requires
require("dotenv").config();
import mongoose from "mongoose";
import cron from "node-cron";
import getMomentString from "./Utils/DateHelper";
import getAccValue from "./Utils/GetAccValue";

import ManageBadgesService from "./Services/BadgesManagerService";
import ManageAccountsService from "./Services/AccountManagerService";

console.log(`${getMomentString()} - $$ BOT DUS GURI ONLINE $$`);
const run = async () => {
  console.log(`${getMomentString()} - Fazendo a primeira verificação`);

  try {
    if (!process.env.MONGO_URL)
      throw new Error("MongoDB Server not initialized");

    await mongoose
      .connect(process.env.MONGO_URL)
      .then(() => console.log(`${getMomentString()} - Conectado com o MongoDB`))
      .catch((e) =>
        console.log(`${getMomentString()} - Erro ao conectar com o MongoDB`, e)
      );
    // await getAccValue("tonelive");
    // await AccountManager.UpAccountsToMongo();

    await ManageAccountsService.LocalAccountUpdater();
    await ManageBadgesService.searchForNewBadges();
  } catch (e) {
    console.error(e);
  }
};

// Todos os dias, 1x por hora, no minuto 0 e no minuto 30
cron.schedule("00 00,30 */1 * * * *", () => {
  console.log(`\n${getMomentString()} - CRON CHAMANDO - Procurar emblemas\n`);
  ManageBadgesService.searchForNewBadges();
});

// Todos os dias as 6h da manha e 18h
cron.schedule("00 00 6,18 * * * *", () => {
  console.log(`\n${getMomentString()} - CRON CHAMANDO - Atualizar contas locais\n`);
  ManageAccountsService.LocalAccountUpdater();
});

run();
