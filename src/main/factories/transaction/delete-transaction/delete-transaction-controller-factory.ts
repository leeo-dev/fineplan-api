import { Controller } from '../../../../presentation/protocols'
import { DbDeleteTransaction } from './../../../../data/usecases/transaction/delete-transaction/db-delete-transaction'
import { TransactionMongoRepository } from './../../../../infra/db/transaction/transaction-mongo-repository'
import { DeleteTransactionController } from './../../../../presentation/controllers/transaction/delete-transaction/delete-transaction-controller'
export const makeDeleteTransactionController = (): Controller => {
  const transactionMongoRepository = new TransactionMongoRepository()
  const dbDeleteTransaction = new DbDeleteTransaction(transactionMongoRepository)
  return new DeleteTransactionController(dbDeleteTransaction)
}
