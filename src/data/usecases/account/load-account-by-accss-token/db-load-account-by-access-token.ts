import { AccountModel } from '../../../../domain/models/account'
import { Decrypter } from '../../../protocols/decrypter'
import { LoadAccountByIdRepository } from '../../../protocols/load-account-by-id-repository'
import { LoadAccountByAccessToken } from '../../../../domain/usecases/account/load-account-by-access-token'
export class DbLoadAccountByAccessToken implements LoadAccountByAccessToken {
  constructor (private readonly decrypter: Decrypter,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository) {}

  async loadIdByAccessToken (accessToken: string): Promise<AccountModel | null> {
    const id = this.decrypter.decrypt(accessToken)
    if (!id) return null
    const account = await this.loadAccountByIdRepository.loadById(String(id))
    if (!account) return null
    return account
  }
}
