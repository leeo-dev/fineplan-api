import { TransactionModel } from '../../../domain/models/transaction'
import { TransactionEdit } from '../../../domain/usecases/transaction/update-transaction'

export interface UpdateTransactionRepository {
  update: (transactionEditParams: TransactionEdit) => Promise<TransactionModel>
}
