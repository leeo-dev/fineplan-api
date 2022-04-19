import { AccountModel } from '../../../../domain/models/account'
import { Decrypter, DecrypterParam } from '../../../protocols/decrypter'
import { LoadAccountByIdRepository } from '../../../protocols/load-account-by-id-repository'
import { LoadAccountByAccessToken } from '../../../../domain/usecases/account/load-account-by-access-token'
export class DbLoadAccountByAccessToken implements LoadAccountByAccessToken {
  constructor (private readonly decrypter: Decrypter,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository) {}

  async loadIdByAccessToken (accessToken: string): Promise<AccountModel | null> {
    const decryptToken: DecrypterParam | null = this.decrypter.decrypt(accessToken)
    if (!decryptToken) return null
    const account = await this.loadAccountByIdRepository.loadById(decryptToken.id)
    if (!account) return null
    return account
  }
}
