import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AddAccountMongoRepository } from './account-mongo-repository'
import { MongoHelper } from './../helpers/mongo-helper'

const makeSut = (): AddAccountMongoRepository => {
  return new AddAccountMongoRepository()
}

const mockAccountParams = (): AddAccountParams => ({
  username: 'any_username',
  password: 'hashed_password'
})

describe('AddAccountMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect('mongodb://localhost:27017/finePlanApi')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should returns an id on success', async () => {
    const sut = makeSut()
    const id = await sut.add(mockAccountParams())
    console.log(id)
    expect(id).toBeTruthy()
  })
})
