import { ObjectId } from "mongoose";
import { AccountDataInterface } from "../../Services/AccountManagerService";

export default interface AccountsRepository {
  create(account: AccountDataInterface): Promise<AccountDataInterface>;
  delete(email: string): Promise<void>;
  get(email: string): Promise<AccountDataInterface>;
  getAll(): Promise<AccountDataInterface[]>;
  addBadge(email: string, badge: string): Promise<void>;
}
