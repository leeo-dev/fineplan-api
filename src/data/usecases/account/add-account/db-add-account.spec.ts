import { expect, test, describe, jest } from '@jest/globals'
import { DbAddAccount } from './db-add-account'
import { LoadUserByUsernameRepository, Hasher, AccountModel, AddAccountParams, AddAccountRepository } from './db-add-account-protocols'

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
      return await Promise.resolve('hashed_password')
    }
  }

  return new HasherStub()
}
const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepository implements AddAccountRepository {
    async add (addAccount: AddAccountParams): Promise<string> {
      return await Promise.resolve('valid_id')
    }
  }

  return new AddAccountRepository()
}

type SutType = {
  sut: DbAddAccount
  loadUserByUsernameStub: LoadUserByUsernameRepository
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutType => {
  const hasherStub = mockHasher()
  const loadUserByUsernameStub = mockLoadUserByUsername()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const sut = new DbAddAccount(loadUserByUsernameStub, hasherStub, addAccountRepositoryStub)
  return { sut, loadUserByUsernameStub, hasherStub, addAccountRepositoryStub }
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
    await sut.add(mockAccountParams())
    expect(hashSpy).toHaveBeenCalledWith(mockAccountParams().password)
  })
  test('Should throw if hash throw', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.add(mockAccountParams())
    await expect(promise).rejects.toThrow()
  })
  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(mockAccountParams())
    expect(addSpy).toHaveBeenCalledWith(Object.assign({}, mockAccountParams(), { password: 'hashed_password' }))
  })
  test('Should throws if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const account = sut.add(mockAccountParams())
    await expect(account).rejects.toThrow()
  })
  test('Should DbAddAccount return an account id on success', async () => {
    const { sut } = makeSut()
    const id = await sut.add(mockAccountParams())
    expect(id).toBe('valid_id')
  })
})
