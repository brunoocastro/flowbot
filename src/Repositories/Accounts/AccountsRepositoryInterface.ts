import Account from "../../Entities/Account";

export default interface AccountsRepository {
  set(account: Account): Promise<string>;
  delete(email: string): Promise<void>;
  get(email: string): Promise<Account>;
  getAll(): Promise<Account[]>;
}
