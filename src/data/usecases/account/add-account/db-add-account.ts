import { Encrypter } from './../../../protocols/encrypter'
import { AddAccountRepository, Hasher, LoadUserByUsernameRepository, AddAccount, AddAccountParams } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly loadUserByUsername: LoadUserByUsernameRepository,
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly encrypter: Encrypter
  ) {}

  async add (accountParams: AddAccountParams): Promise<string | null> {
    const { username, password } = accountParams
    const account = await this.loadUserByUsername.loadByUsername(username)
    if (account) return null
    const hashPassword = await this.hasher.hash(password)
    const accountId = await this.addAccountRepository.add(Object.assign({}, accountParams, { password: hashPassword }))
    const accessToken = await this.encrypter.encrypt(accountId)
    return accessToken
  }
}
