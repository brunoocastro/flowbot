import Account from "../Entities/Account";
import Repositories from "../Repositories";

export interface AccountDataInterface {
  email: string;
  username: string;
  refreshToken: string;
  badges: string[];
}

export interface AccountsList {
  [key: string]: AccountDataInterface;
}

const accounts: AccountsList = {
  otonelive: {
    email: "otonelive@gmail.com",
    username: "otonelive",
    refreshToken:
      "AFxQ4_qH6OMZuu3nbOXn_a_RuuYbagseg5Gb15geN5i8hWjOcMRVe-mKly9PjqGS28rt7-khISC9km8j6p45yKRBbVim3g6qFuIF91WErESabWrYoNyFmsxYY-kvoEMVkFB2_NQkGIdFjXl2IgxIaSIK3BYN_97cz4IqRVtRGG5ll81zyVnZRVCy9wQiM9F2ydGCiYkJ9e07",
    badges: [],
  },
};

const UpAccountsToMongo = async () => {
  for (const account of Object.values(accounts)) {
    console.log(account);
    await Repositories.AccountsDataRepository.create(account);
  }
};

const LocalAccountUpdater = async () => {
  const AllAccountsData = await Repositories.AccountsDataRepository.getAll();
  console.log("all Acc Data", AllAccountsData);
  for (const account of Object.values(AllAccountsData)) {
    await Repositories.AccountsRepository.set(
      new Account(
        account.email,
        account.username,
        account.refreshToken,
        account.badges
      )
    );
  }
};

export default { LocalAccountUpdater, UpAccountsToMongo };
