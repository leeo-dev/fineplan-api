import { AccountModel } from '@/domain/models/account'
export interface LoadUserByUsernameRepository {
  loadByUsername: (username: string) => Promise<AccountModel | null>
}
