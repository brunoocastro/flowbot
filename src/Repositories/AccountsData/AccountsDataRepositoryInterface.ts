import AccountData from "../../Schemas/AccountData";
import { AccountDataInterface } from "../../Utils/AccountCreator";

export default interface AccountsRepository {
  create(account: AccountDataInterface): Promise<AccountDataInterface>;
  delete(email: string): Promise<void>;
  get(email: string): Promise<AccountDataInterface>;
  getAll(): Promise<AccountDataInterface[]>;
}
