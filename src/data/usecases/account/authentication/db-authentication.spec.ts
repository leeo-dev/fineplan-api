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
      return await Promise.resolve(null)
    }
  }

  return new LoadUserByUsernameStub()
}

type SutTypes = {
  sut: DbAuthentication
  loadUserByUsernameStub: LoadUserByUsernameRepository
}

const makeSut = (): SutTypes => {
  const loadUserByUsernameStub = mockLoadUserByUsernameStub()
  const sut = new DbAuthentication(loadUserByUsernameStub)
  return { sut, loadUserByUsernameStub }
}

describe('Authentication UseCase', () => {
  test('Should call LoadByUsernameRepository with correct username', () => {
    const { sut, loadUserByUsernameStub } = makeSut()
    const loadByUsernameSpy = jest.spyOn(loadUserByUsernameStub, 'loadByUsername')
    sut.auth(mockParams())
    expect(loadByUsernameSpy).toHaveBeenCalledWith(mockParams().username)
  })
})
