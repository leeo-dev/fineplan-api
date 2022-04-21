import { TransactionModel } from '../../models/transaction'
export interface LoadTransactions {
  loadAll: (userId: string) => Promise<TransactionModel[]>

}
