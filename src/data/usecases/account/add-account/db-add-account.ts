import { Hasher } from '@/data/protocols/hasher'
import { LoadUserByUsernameRepository } from '@/data/protocols/load-user-by-username-repository'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly loadUserByUsername: LoadUserByUsernameRepository,
    private readonly hasher: Hasher
  ) {}

  async add (accountParams: AddAccountParams): Promise<string | null> {
    const { username, password } = accountParams
    const account = await this.loadUserByUsername.loadByUsername(username)
    if (account) return null
    await this.hasher.hash(password)
    return 'any'
  }
}
