import { AddAccountMongoRepository } from './account-mongo-repository'
import { AddAccountParams } from './account-mongo-repository-protocols'

import { MongoHelper } from './../../helpers/mongo-helper'
import { Collection } from 'mongodb'
import { expect, test, describe, beforeAll, afterAll, beforeEach } from '@jest/globals'

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
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
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
  describe('loadById()', () => {
    test('should return and account on loadById success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(mockAccountParams())
      const accountMongo = await sut.loadByUsername(mockAccountParams().username)
      const account = await sut.loadById(String(accountMongo?.id))
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.username).toBeTruthy()
      expect(account?.password).toBeTruthy()
    })
  })
})
