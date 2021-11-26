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
  teste: {
    email: "teste@gmail.com",
    username: "teste",
    refreshToken:
      "",
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
