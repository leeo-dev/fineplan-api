import { AccountModel } from './../../models/account'
export interface LoadAccountByAccessToken {
  loadIdByAccessToken: (accessToken: string) => Promise<AccountModel | null>
}
