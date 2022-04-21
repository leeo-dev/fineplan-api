import { DbLoadAccountByAccessToken } from './db-load-account-by-access-token'
import { LoadAccountByIdRepository, Decrypter, DecrypterParam, AccountModel } from './db-load-account-by-access-token-protocols'
import { expect, test, describe, jest } from '@jest/globals'

const mockAccount = (): AccountModel => ({
  id: 'any_id',
  username: 'any_username',
  password: 'any_password'
})

const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    decrypt (accessToken: string): DecrypterParam | null {
      return { id: 'any_id', iat: 20395823 }
    }
  }
  return new DecrypterStub()
}
const mockLoadAccountByIdRepositoryStub = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async loadById (id: string): Promise<AccountModel | null> {
      return mockAccount()
    }
  }
  return new LoadAccountByIdRepositoryStub()
}

type SutTypes = {
  sut: DbLoadAccountByAccessToken
  decrypterStub: Decrypter
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByIdRepositoryStub = mockLoadAccountByIdRepositoryStub()
  const decrypterStub = mockDecrypter()
  const sut = new DbLoadAccountByAccessToken(decrypterStub, loadAccountByIdRepositoryStub)
  return { sut, decrypterStub, loadAccountByIdRepositoryStub }
}
describe('DbLoadAccountIdByAccessToken', () => {
  test('Should call decrypter with correct token', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.loadIdByAccessToken('any_accessToken')
    expect(decryptSpy).toHaveBeenCalledWith('any_accessToken')
  })
  test('Should return null if decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(null)
    const id = await sut.loadIdByAccessToken('any_accessToken')
    expect(id).toBeNull()
  })

  test('Should return null LoadAccountById return null', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.loadIdByAccessToken('any_accessToken')
    expect(account).toBeNull()
  })

  test('Should call LoadAccountById with correct id', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById')
    await sut.loadIdByAccessToken('any_accessToken')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should throw if LoadAccountById throws', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.loadIdByAccessToken('any_accessToken')
    await expect(promise).rejects.toThrow()
  })
  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.loadIdByAccessToken('any_accessToken')
    expect(account).toEqual(mockAccount())
  })
  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.loadIdByAccessToken('any_accessToken')
    expect(account).toEqual(mockAccount())
  })
})
