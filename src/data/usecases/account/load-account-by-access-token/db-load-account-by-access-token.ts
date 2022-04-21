import { AccountModel, Decrypter, LoadAccountByIdRepository, LoadAccountByAccessToken } from './db-load-account-by-access-token-protocols'
export class DbLoadAccountByAccessToken implements LoadAccountByAccessToken {
  constructor (private readonly decrypter: Decrypter,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository) {}

  async loadIdByAccessToken (accessToken: string): Promise<AccountModel | null> {
    const decryptToken: any = this.decrypter.decrypt(accessToken)
    console.log(decryptToken)

    if (!decryptToken) return null
    const account = await this.loadAccountByIdRepository.loadById(decryptToken.id)
    if (!account) return null
    return account
  }
}
