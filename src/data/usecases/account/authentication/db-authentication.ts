import { Encrypter } from './../../../protocols/encrypter'
import { HashComparer } from './../../../protocols/hash-comparer'
import { LoadUserByUsernameRepository } from './../../../protocols/load-user-by-username-repository'
import { Authentication } from '@/domain/usecases/account/authentication'
import { AddAccountParams } from '../add-account/db-add-account-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadUserByUsernameRepository: LoadUserByUsernameRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter) {}

  async auth (data: AddAccountParams): Promise<string | null> {
    const account = await this.loadUserByUsernameRepository.loadByUsername(data.username)
    if (account) {
      const isValid = await this.hashComparer.compare(data.password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        return accessToken
      }
    }
    return null
  }
}
