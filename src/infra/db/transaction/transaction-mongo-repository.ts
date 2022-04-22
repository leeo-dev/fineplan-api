import { TransactionParam, AddTransactionRepository, LoadTransactions } from './transaction-mongo-repository-protocols'
import { MongoHelper } from './../../helpers/mongo-helper'
import { TransactionModel } from '@/domain/models/transaction'

export class TransactionMongoRepository implements AddTransactionRepository, LoadTransactions {
  async add (transactionData: TransactionParam): Promise<void> {
    const transactionsCollection = await MongoHelper.getCollection('transactions')
    await transactionsCollection.insertOne(Object.assign({}, transactionData, { date: new Date(transactionData.date) }))
  }

  async loadAll (userId: string): Promise<TransactionModel[]> {
    const transactionsCollection = await MongoHelper.getCollection('transactions')
    const transactions = await transactionsCollection.find({ user_id: userId }).toArray()
    return transactions && MongoHelper.mapArray(transactions)
  }
}
