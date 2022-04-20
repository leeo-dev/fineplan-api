import { LoadAccountByIdRepository, AddAccountRepository, LoadUserByUsernameRepository, AccountModel, AddAccountParams } from './account-mongo-repository-protocols'
import { MongoHelper } from '../../helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class AddAccountMongoRepository implements AddAccountRepository, LoadUserByUsernameRepository, LoadAccountByIdRepository {
  async add (addAccount: AddAccountParams): Promise<string> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountId = await accountCollection.insertOne(addAccount)
    return String(accountId.insertedId)
  }

  async loadByUsername (username: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountMongo = await accountCollection.findOne({ username })
    const account = accountMongo && MongoHelper.map(accountMongo)
    return account
  }

  async loadById (id: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountMongo = await accountCollection.findOne({ _id: new ObjectId(id) })
    return accountMongo ? MongoHelper.map(accountMongo) : null
  }
}
