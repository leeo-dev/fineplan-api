import { UpdateTransactionRepository } from './../../../data/protocols/transaction/update-transaction-repository'
import { LoadTransactionByIdRepository } from './../../../data/protocols/transaction/load-transaction-by-id-repository'
import { ObjectId } from 'mongodb'
import { TransactionParam, AddTransactionRepository, LoadTransactions, DeleteTransactionRepository } from './transaction-mongo-repository-protocols'
import { MongoHelper } from './../../helpers/mongo-helper'
import { TransactionModel } from '@/domain/models/transaction'
import { TransactionEdit } from '@/domain/usecases/transaction/update-transaction'

export class TransactionMongoRepository implements AddTransactionRepository, LoadTransactions, DeleteTransactionRepository, LoadTransactionByIdRepository, UpdateTransactionRepository {
  async add (transactionData: TransactionParam): Promise<void> {
    const transactionsCollection = await MongoHelper.getCollection('transactions')
    await transactionsCollection.insertOne(Object.assign({}, transactionData, { date: new Date(transactionData.date) }))
  }

  async loadAll (userId: string): Promise<TransactionModel[]> {
    const transactionsCollection = await MongoHelper.getCollection('transactions')
    const transactions = await transactionsCollection.find({ user_id: userId }).toArray()
    return transactions && MongoHelper.mapArray(transactions)
  }

  async delete (id: string): Promise<void> {
    const transactionsCollection = await MongoHelper.getCollection('transactions')
    await transactionsCollection.deleteOne({ _id: new ObjectId(id) })
  }

  async loadById (id: string): Promise<boolean> {
    const transactionsCollection = await MongoHelper.getCollection('transactions')
    const transaction = await transactionsCollection.findOne({ _id: new ObjectId(id) })
    return transaction && MongoHelper.map(transaction)
  }

  async update (transactionEditParams: TransactionEdit): Promise<TransactionModel> {
    const { title, type, amount, date } = transactionEditParams
    const transactionsCollection = await MongoHelper.getCollection('transactions')
    const transaction = await transactionsCollection.findOneAndUpdate({ $and: [{ _id: new ObjectId(transactionEditParams.id) }, { user_id: transactionEditParams.user_id }] }, { $set: { title, type, amount, date } }, { returnDocument: 'after' })
    return transaction && MongoHelper.map(transaction.value)
  }
}
