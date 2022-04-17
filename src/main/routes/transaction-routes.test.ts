import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { test, describe, beforeAll, beforeEach, afterAll } from '@jest/globals'

let accountCollection: Collection

describe('Transaction Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('transactions')
    await accountCollection.deleteMany({})
  })

  test('Should create a transaction on success', async () => {
    await request(app)
      .post('/api/transaction/deposit')
      .send({ title: 'Salário', amount: 2000, date: '2022-02-02' })
      .expect(204)
  })
})
