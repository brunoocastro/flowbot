import Account from "../../Entities/Account";
import AccountsRepository from "./AccountsRepositoryInterface";

export default class AccountsMemoryRepository implements AccountsRepository {
  private accounts: { [key: string]: Account } = {};
  async set(account: Account) {
    this.accounts[account.email] = account;
    return account.username;
  }

  async delete(email: string) {
    delete this.accounts[email];
  }

  async get(email: string) {
    return this.accounts[email];
  }

  async getAll() {
    return Object.values(this.accounts);
  }
}
