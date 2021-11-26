import Account from "../../Entities/Account";
import AccountData from "../../Schemas/AccountData";
import { AccountDataInterface } from "../../Services/AccountManagerService";
import AccountsDataRepository from "./AccountsDataRepositoryInterface";
import { BadgeData } from "../Badges/BadgesRepositoryInterface";
import { ObjectId } from "mongoose";

export default class AccountsDataMongoRepository
  implements AccountsDataRepository
{
  private accounts: { [key: string]: Account } = {};
  async create(account: AccountDataInterface) {
    const accountCreated = await AccountData.create(account);
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

  async addBadge(mail: string, badge: string) {
    await AccountData.updateOne(
      { email: mail },
      { $addToSet: { badges: badge } }
    );
  }
}
