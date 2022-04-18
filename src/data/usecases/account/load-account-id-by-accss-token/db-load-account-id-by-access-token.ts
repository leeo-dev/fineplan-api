import { Decrypter } from './../../../protocols/decrypter'
import { LoadAccountIdByAccessToken } from './../../../../domain/usecases/account/load-account-id-by-access-token'
export class DbLoadAccountIdByAccessToken implements LoadAccountIdByAccessToken {
  constructor (private readonly decrypter: Decrypter) {}
  async loadIdByAccessToken (accessToken: string): Promise<string | null> {
    this.decrypter.decrypt(accessToken)
    return await Promise.resolve(null)
  }
}
