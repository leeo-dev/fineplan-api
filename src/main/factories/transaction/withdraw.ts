import { DbAddTransaction } from '../../../data/usecases/transaction/db-add-transaction'
import { TransactionMongoRepository } from '../../../infra/db/transaction/transaction-mongo-repository'
import { WithdrawController } from '../../../presentation/controllers/transaction/withdraw/withdraw-controller'
import { Controller } from './../../../presentation/protocols/controller'
export const makeWithdrawController = (): Controller => {
  const addTransactionRepository = new TransactionMongoRepository()
  const addTransaction = new DbAddTransaction(addTransactionRepository)
  return new WithdrawController(addTransaction)
}
