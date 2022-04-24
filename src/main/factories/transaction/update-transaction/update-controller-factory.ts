import { DbUpdateTransaction } from './../../../../data/usecases/transaction/update-transaction/db-update-transaction'
import { UpdateTransactionController } from './../../../../presentation/controllers/transaction/update-transaction/update-transaction-controller'
import { makeUpdateValidation } from './update-validation-factory'
import { TransactionMongoRepository } from '../../../../infra/db/transaction/transaction-mongo-repository'
import { Controller } from '../../../../presentation/protocols/controller'
export const makeUpdateTransactionControllerFactory = (): Controller => {
  const transactionMongoRepository = new TransactionMongoRepository()
  const updateTransaction = new DbUpdateTransaction(transactionMongoRepository, transactionMongoRepository)
  return new UpdateTransactionController(updateTransaction, makeUpdateValidation())
}
