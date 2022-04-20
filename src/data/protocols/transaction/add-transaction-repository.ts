import { TransactionParam } from '../../../domain/usecases/transaction/add-transaction'
export interface AddTransactionRepository {
  add: (transactionData: TransactionParam) => Promise<void>
}
