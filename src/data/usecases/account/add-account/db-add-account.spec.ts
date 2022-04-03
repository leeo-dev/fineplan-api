
import { DbAddAccount } from './db-add-account'
import { LoadUserByUsernameRepository } from '@/data/protocols/load-user-by-username-repository'
import { Hasher } from '@/data/protocols/hasher'
import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'

const mockAccountParams = (): AddAccountParams => ({
  username: 'any_username',
  password: 'any_password'
})

const mockAccount = (): AccountModel => ({
  id: 'any_id',
  username: 'any_username',
  password: 'any_password'
})

const mockLoadUserByUsername = (): LoadUserByUsernameRepository => {
  class LoadUserByUsernameStub implements LoadUserByUsernameRepository {
    async loadByUsername (username: string): Promise<AccountModel | null> {
      return await Promise.resolve(null)
    }
  }

  return new LoadUserByUsernameStub()
}

const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('any_hash')
    }
  }

  return new HasherStub()
}

type SutType = {
  sut: DbAddAccount
  loadUserByUsernameStub: LoadUserByUsernameRepository
  hasherStub: Hasher
}

const makeSut = (): SutType => {
  const hasherStub = mockHasher()
  const loadUserByUsernameStub = mockLoadUserByUsername()
  const sut = new DbAddAccount(loadUserByUsernameStub, hasherStub)
  return { sut, loadUserByUsernameStub, hasherStub }
}

describe('DbAddAccount UseCase', () => {
  test('Should call LoadUserByUsername with correct username', async () => {
    const { sut, loadUserByUsernameStub } = makeSut()
    const loadByUsername = jest.spyOn(loadUserByUsernameStub, 'loadByUsername')
    await sut.add(mockAccountParams())
    expect(loadByUsername).toHaveBeenCalledWith(mockAccountParams().username)
  })
  test('Should return null if LoadUserByUsername return an account', async () => {
    const { sut, loadUserByUsernameStub } = makeSut()
    jest.spyOn(loadUserByUsernameStub, 'loadByUsername').mockReturnValueOnce(Promise.resolve(mockAccount()))
    const account = await sut.add(mockAccountParams())
    expect(account).toBeNull()
  })
  test('Should throws if LoadUserByUsername throws', async () => {
    const { sut, loadUserByUsernameStub } = makeSut()
    jest.spyOn(loadUserByUsernameStub, 'loadByUsername').mockImplementationOnce(() => {
      throw new Error()
    })
    const account = sut.add(mockAccountParams())
    await expect(account).rejects.toThrow()
  })
  test('Should call hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const httpResponse = await sut.add(mockAccountParams())
    console.log(httpResponse)
    expect(hashSpy).toHaveBeenCalledWith(mockAccountParams().password)
  })
})
