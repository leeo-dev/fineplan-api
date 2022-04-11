import { HashComparer } from './../../../protocols/hash-comparer'
import { DbAuthentication } from './db-authentication'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { LoadUserByUsernameRepository } from './../../../protocols/load-user-by-username-repository'
import { AddAccountParams } from './../../../../domain/usecases/account/add-account'
import { expect, test, describe, jest } from '@jest/globals'

const mockParams = (): AddAccountParams => ({
  username: 'any_username',
  password: 'any_password'
})

const mockLoadUserByUsernameStub = (): LoadUserByUsernameRepository => {
  class LoadUserByUsernameStub implements LoadUserByUsernameRepository {
    async loadByUsername (username: string): Promise<AccountModel | null> {
      return await Promise.resolve(Object.assign({}, mockParams(), { id: 'any_id', password: 'hashed_password' }))
    }
  }

  return new LoadUserByUsernameStub()
}

const mockHashCompareStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (values: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }

  return new HashComparerStub()
}

type SutTypes = {
  sut: DbAuthentication
  loadUserByUsernameStub: LoadUserByUsernameRepository
  hashCompareStub: HashComparer
}

const makeSut = (): SutTypes => {
  const loadUserByUsernameStub = mockLoadUserByUsernameStub()
  const hashCompareStub = mockHashCompareStub()
  const sut = new DbAuthentication(loadUserByUsernameStub, hashCompareStub)
  return { sut, loadUserByUsernameStub, hashCompareStub }
}

describe('Authentication UseCase', () => {
  test('Should call LoadByUsernameRepository with correct username', () => {
    const { sut, loadUserByUsernameStub } = makeSut()
    const loadByUsernameSpy = jest.spyOn(loadUserByUsernameStub, 'loadByUsername')
    sut.auth(mockParams())
    expect(loadByUsernameSpy).toHaveBeenCalledWith(mockParams().username)
  })

  test('Should DbAuthentication return null if LoadByUsernameRepository returns null', async () => {
    const { sut, loadUserByUsernameStub } = makeSut()
    jest.spyOn(loadUserByUsernameStub, 'loadByUsername').mockReturnValueOnce(Promise.resolve(null))
    const accessToken = await sut.auth(mockParams())
    expect(accessToken).toBeNull()
  })

  test('Should DbAuthentication throws if LoadByUsernameRepository throw', async () => {
    const { sut, loadUserByUsernameStub } = makeSut()
    jest.spyOn(loadUserByUsernameStub, 'loadByUsername').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.auth(mockParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call HashComparer with correct password', async () => {
    const { sut, hashCompareStub } = makeSut()
    const compareSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.auth(mockParams())
    expect(compareSpy).toHaveBeenCalledWith(mockParams().password, 'hashed_password')
  })

  test('Should DbAuthentication throws if HashComparer throw', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.auth(mockParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should DbAuthentication returns null if HashComparer returns false', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const accessToken = await sut.auth(mockParams())
    expect(accessToken).toBeNull()
  })
})
