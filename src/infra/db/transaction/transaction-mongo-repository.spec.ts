import { TransactionMongoRepository } from './transaction-mongo-repository'
import { TransactionParam } from './transaction-mongo-repository-protocols'
import { MongoHelper } from './../../helpers/mongo-helper'

import { Collection } from 'mongodb'
import MockDate from 'mockdate'

import { expect, test, describe, beforeAll, afterAll, beforeEach } from '@jest/globals'

const makeSut = (): TransactionMongoRepository => {
  return new TransactionMongoRepository()
}

const mockTransaction = (type: string): TransactionParam => ({
  title: 'any_title',
  amount: 250,
  date: new Date('2020-05-05'),
  created_at: new Date(),
  type,
  user_id: 'any_id'
})

describe('Name of the group', () => {
  let transactionCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
    MockDate.set(new Date())
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  beforeEach(async () => {
    transactionCollection = await MongoHelper.getCollection('transactions')
    await transactionCollection.deleteMany({})
  })
  test('Should TransactionMongoRepository insert a transaction successfully', async () => {
    const sut = makeSut()
    await sut.add(mockTransaction('deposit'))
    const transactionMongo = await transactionCollection.findOne({ title: 'any_title' })
    const transaction = MongoHelper.map(transactionMongo)
    expect(transaction).toBeTruthy()
    expect(transaction?.id).toBeTruthy()
    expect(transaction?.title).toBeTruthy()
    expect(transaction?.amount).toBeTruthy()
    expect(transaction?.date).toBeTruthy()
    expect(transaction?.created_at).toBeTruthy()
  })
})
