import AccountsMemoryRepository from "./Accounts/AccountsMemoryRepository";
import BadgesMemoryRepository from "./Badges/BadgesMemoryRepository";

const BadgesRepository = new BadgesMemoryRepository();
const AccountsRepository = new AccountsMemoryRepository();

export default {
  BadgesRepository,
  AccountsRepository,
};
