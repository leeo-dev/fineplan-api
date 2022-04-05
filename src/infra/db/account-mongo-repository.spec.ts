import { AddAccountParams } from '../../domain/usecases/account/add-account'
import { expect, test, describe, beforeAll, afterAll, beforeEach } from '@jest/globals'

import { AddAccountMongoRepository } from './account-mongo-repository'
import { MongoHelper } from './../helpers/mongo-helper'
import { Collection } from 'mongodb'

let accountCollection: Collection

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

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('add()', () => {
    test('Should returns an id on success', async () => {
      const sut = makeSut()
      const id = await sut.add(mockAccountParams())
      console.log(id)
      expect(id).toBeTruthy()
    })
  })
  describe('loadByUsername()', () => {
    test('should return and account on loadByUsername success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(mockAccountParams())
      const account = await sut.loadByUsername(mockAccountParams().username)
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.username).toBeTruthy()
      expect(account?.password).toBeTruthy()
    })
  })
})
