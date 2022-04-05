import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { test, describe, beforeAll, beforeEach, afterAll } from '@jest/globals'

let accountCollection: Collection

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect('mongodb://localhost:27017/tests')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({ username: 'leo-dev', password: '@MyPassword' })
      .expect(200)
  })
})
