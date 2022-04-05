import { AddAccountRepository, Hasher, LoadUserByUsernameRepository, AddAccount, AddAccountParams } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly loadUserByUsername: LoadUserByUsernameRepository,
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountParams: AddAccountParams): Promise<string | null> {
    const { username, password } = accountParams
    const account = await this.loadUserByUsername.loadByUsername(username)
    if (account) return null
    const hashPassword = await this.hasher.hash(password)
    const newAccount = Object.assign({}, accountParams, { password: hashPassword })
    const accountId = await this.addAccountRepository.add(newAccount)
    return accountId
  }
}
