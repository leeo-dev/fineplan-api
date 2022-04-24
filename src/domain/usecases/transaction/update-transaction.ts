import { TransactionModel } from '@/domain/models/transaction'
export type TransactionEdit = Omit<TransactionModel, 'created_at'>
export interface UpdateTransaction {
  update: (transaction: TransactionEdit) => Promise<TransactionModel | null>

}
