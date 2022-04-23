import { TransactionParam } from './../../domain/usecases/transaction/add-transaction'
import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/helpers/mongo-helper'
import { Collection } from 'mongodb'
import jwt from 'jsonwebtoken'
import { test, describe, beforeAll, beforeEach, afterAll } from '@jest/globals'
import env from '../config/env'

let transactionCollection: Collection
let accountCollection: Collection

const mockTransactions = (): TransactionParam => (
  { title: 'any_title', amount: -250, date: new Date(), type: 'withdraw', created_at: new Date(), user_id: 'any_user_id' }
)

const insertUser = async (): Promise<string[]> => {
  const account = await accountCollection.insertOne({ username: 'any_user', password: 'any_password' })
  const accessToken = jwt.sign({ id: String(account.insertedId) }, env.JWT_SECRET)
  return [accessToken, String(account.insertedId)]
}

const insertTransaction = async (accountId: string): Promise<any> => {
  const transactions = await transactionCollection.insertMany([
    { title: 'any_title', amount: -250, date: new Date(), type: 'withdraw', created_at: new Date(), user_id: accountId },
    { title: 'other_title', amount: 1200, date: new Date(), type: 'deposit', created_at: new Date(), user_id: 'other_user_id' }
  ])
  return transactions.insertedIds
}

describe('Transaction Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    transactionCollection = await MongoHelper.getCollection('transactions')
    accountCollection = await MongoHelper.getCollection('accounts')
    await transactionCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })
  describe('Deposit', () => {
    test('Should create a transaction (deposit) on success', async () => {
      await request(app)
        .post('/api/transaction/deposit')
        .send({ title: 'Salário', amount: 2000, date: '2022-02-02' })
        .expect(403)
    })
  })
  describe('Withdraw', () => {
    test('Should create a transaction (withdraw) on success', async () => {
      await request(app)
        .post('/api/transaction/withdraw')
        .send({ title: 'Salário', amount: 2000, date: '2022-02-02' })
        .expect(403)
    })
  })
  describe('LoadTransactions', () => {
    test('Should load a list of transaction on success', async () => {
      const [accessToken, accountId] = await insertUser()
      await insertTransaction(accountId)
      await request(app)
        .get('/api/transactions')
        .set('x-access-token', accessToken)
        .send(mockTransactions())
        .expect(200)
    })
  })
  describe('DeleteTransaction', () => {
    test('Should delete a transaction on success', async () => {
      const [accessToken, accountId] = await insertUser()
      const transactions = await insertTransaction(accountId)
      const transactionId: string = String(transactions['0'])
      await request(app)
        .delete(`/api/transactions/${transactionId}`)
        .set('x-access-token', accessToken)
        .send(mockTransactions())
        .expect(204)
    })
  })
})
