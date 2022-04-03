
import { DbAddAccount } from './db-add-account'
import { LoadUserByUsernameRepository } from '@/data/protocols/load-user-by-username-repository'
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
      return await Promise.resolve(mockAccount())
    }
  }

  return new LoadUserByUsernameStub()
}

type SutType = {
  sut: DbAddAccount
  loadUserByUsernameStub: LoadUserByUsernameRepository
}

const makeSut = (): SutType => {
  const loadUserByUsernameStub = mockLoadUserByUsername()
  const sut = new DbAddAccount(loadUserByUsernameStub)
  return { sut, loadUserByUsernameStub }
}

describe('DbAddAccount UseCase', () => {
  test('Should call LoadUserByUsername with correct username', async () => {
    const { sut, loadUserByUsernameStub } = makeSut()
    const loadByUsername = jest.spyOn(loadUserByUsernameStub, 'loadByUsername')
    await sut.add(mockAccountParams())
    expect(loadByUsername).toHaveBeenCalledWith(mockAccountParams().username)
  })
  test('Should return null if LoadUserByUsername is not null', async () => {
    const { sut } = makeSut()
    const account = await sut.add(mockAccountParams())
    expect(account).toBeNull()
  })
})
