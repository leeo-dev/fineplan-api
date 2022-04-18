import { Decrypter } from './../../../protocols/decrypter'
import { LoadAccountByIdRepository } from './../../../protocols/load-account-by-id-repository'
import { LoadAccountIdByAccessToken } from './../../../../domain/usecases/account/load-account-id-by-access-token'
export class DbLoadAccountIdByAccessToken implements LoadAccountIdByAccessToken {
  constructor (private readonly decrypter: Decrypter,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository) {}

  async loadIdByAccessToken (accessToken: string): Promise<string | null> {
    const id = this.decrypter.decrypt(accessToken)
    await this.loadAccountByIdRepository.loadById(String(id))
    return await Promise.resolve(id)
  }
}
