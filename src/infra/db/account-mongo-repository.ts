import { AddAccountRepository } from '@/data/protocols/add-account-repository'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
export class AddAccountMongoRepository implements AddAccountRepository {
  async add (addAccount: AddAccountParams): Promise<string> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountId = await accountCollection.insertOne(addAccount)
    return String(accountId.insertedId)
  }
}
