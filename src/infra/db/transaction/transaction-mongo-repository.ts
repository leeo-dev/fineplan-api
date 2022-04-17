import { TransactionParam } from '../../../domain/usecases/transaction/add-transaction'
import { AddTransactionRepository } from './../../../data/protocols/add-transaction-repository'
import { MongoHelper } from './../../helpers/mongo-helper'

export class TransactionMongoRepository implements AddTransactionRepository {
  async add (transactionData: TransactionParam): Promise<void> {
    const transactionsCollection = await MongoHelper.getCollection('transactions')
    await transactionsCollection.insertOne(Object.assign({}, transactionData, { date: new Date(transactionData.date) }))
  }
}
