import Account from "../../Entities/Account";
import AccountData from "../../Schemas/AccountData";
import { AccountDataInterface } from "../../Utils/AccountCreator";
import AccountsDataRepository from "./AccountsDataRepositoryInterface";

export default class AccountsDataMongoRepository
  implements AccountsDataRepository
{
  private accounts: { [key: string]: Account } = {};
  async create(account: AccountDataInterface) {
    const accountCreated = await AccountData.create({ account });
    return accountCreated.toJSON();
  }

  async delete(email: string) {
    delete this.accounts[email];
  }

  async get(email: string) {
    const account = await AccountData.findOne({ email }).lean();
    return account;
  }

  async getAll() {
    const allAccounts = await AccountData.find({}).lean();
    return allAccounts;
  }
}
