import { TransactionModel } from '@/domain/models/transaction'
export interface UpdateTransaction {
  update: (transactionId: string, userId: string) => Promise<TransactionModel | null>

}
