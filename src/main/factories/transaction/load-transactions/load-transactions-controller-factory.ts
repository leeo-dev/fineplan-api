import { TransactionMongoRepository } from './../../../../infra/db/transaction/transaction-mongo-repository'
import { DbLoadTransactions } from './../../../../data/usecases/transaction/load-transactions/db-load-transactions'
import { LoadTransactionsController } from './../../../../presentation/controllers/transaction/load-transactions/load-transactions-controller'
import { Controller } from './../../../../presentation/protocols/controller'
export const makeLoadTransactionsController = (): Controller => {
  const transactionMongoRepository = new TransactionMongoRepository()
  const dbLoadTransactions = new DbLoadTransactions(transactionMongoRepository)
  return new LoadTransactionsController(dbLoadTransactions)
}
