import { Encrypter, HashComparer, LoadUserByUsernameRepository, Authentication, AddAccountParams } from './db-authentication-protocols'

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
        const accessToken = this.encrypter.encrypt(account.id)

        return await accessToken
      }
    }
    return null
  }
}
