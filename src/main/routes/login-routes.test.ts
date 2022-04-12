import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/helpers/mongo-helper'
import { Collection } from 'mongodb'
import bcrypt from 'bcrypt'
import { test, describe, beforeAll, beforeEach, afterAll } from '@jest/globals'

let accountCollection: Collection

describe('SignUp Routes', () => {
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

  test('Should return an access token on success', async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    const password = await bcrypt.hash('@MyPassword', 12)
    await accountCollection.insertOne({ username: 'leeodev', password })
    await accountCollection.findOne({ username: 'leeodev' })
    await request(app)
      .post('/api/login')
      .send({ username: 'leeodev', password: '@MyPassword' })
      .expect(200)
  })
})
