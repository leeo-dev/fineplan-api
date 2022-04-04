import { AddAccountRepository } from '@/data/protocols/add-account-repository'
import { Hasher } from '@/data/protocols/hasher'
import { LoadUserByUsernameRepository } from '@/data/protocols/load-user-by-username-repository'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'

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
