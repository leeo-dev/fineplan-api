import { TransactionModel } from '../../../domain/models/transaction'
export interface LoadTransactionsRepository {
  loadAll: (userId: string) => Promise<TransactionModel[]>

}
