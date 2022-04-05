import { AddAccountRepository } from '@/data/protocols/add-account-repository'
import { LoadUserByUsernameRepository } from '@/data/protocols/load-user-by-username-repository'
import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { MongoHelper } from '@/infra/helpers/mongo-helper'
export class AddAccountMongoRepository implements AddAccountRepository, LoadUserByUsernameRepository {
  async add (addAccount: AddAccountParams): Promise<string> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountId = await accountCollection.insertOne(addAccount)
    return String(accountId.insertedId)
  }

  async loadByUsername (username: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountMongo = await accountCollection.findOne({ username })
    return accountMongo && MongoHelper.map(accountMongo)
  }
}
