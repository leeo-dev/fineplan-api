import { TransactionMongoRepository } from './transaction-mongo-repository'
import { TransactionModel, TransactionParam } from './transaction-mongo-repository-protocols'
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

const mockTransactions = (): TransactionModel[] => ([
  { id: 'any_id', title: 'any_title', amount: -250, date: new Date(), type: 'withdraw', created_at: new Date(), user_id: 'any_user_id' },
  { id: 'other_id', title: 'other_title', amount: 1200, date: new Date(), type: 'deposit', created_at: new Date(), user_id: 'other_user_id' }
])

describe('Transaction Mongo Repository', () => {
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
  describe('add()', () => {
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
  describe('loadAll()', () => {
    test('Should TransactionMongoRepository insert a transaction successfully', async () => {
      await transactionCollection.insertMany(mockTransactions())
      const sut = makeSut()
      const transactions = await sut.loadAll('any_user_id')
      expect(transactions).toBeTruthy()
    })
  })
  describe('loadById()', () => {
    test('Should TransactionMongoRepository load a transaction successfully', async () => {
      const sut = makeSut()
      const transactionMongo = await transactionCollection.insertOne(mockTransaction('deposit'))
      const transaction = await sut.loadById(String(transactionMongo.insertedId))
      expect(transaction).toBeTruthy()
    })
  })
  describe('delete()', () => {
    test('Should TransactionMongoRepository delete a transaction successfully', async () => {
      const transactionMongo = await transactionCollection.insertOne(mockTransaction('deposit'))
      const sut = makeSut()
      await sut.delete(String(transactionMongo.insertedId))
      const transactions = await transactionCollection.findOne({ _id: transactionMongo.insertedId })
      expect(transactions).toBeFalsy()
    })
  })
})
