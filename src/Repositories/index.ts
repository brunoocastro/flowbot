import AccountsMemoryRepository from "./Accounts/AccountsMemoryRepository";
import AccountsDataMongoRepository from "./AccountsData/AccountsDataMongoRepository";
import BadgesMongoRepository from "./Badges/BadgesMongoRepository";

const BadgesRepository = new BadgesMongoRepository();
const AccountsRepository = new AccountsMemoryRepository();
const AccountsDataRepository = new AccountsDataMongoRepository();

export default {
  BadgesRepository,
  AccountsRepository,
  AccountsDataRepository,
};
