import { TransactionModel } from '../../../../domain/models/transaction'
import { TransactionEdit } from '../../../../domain/usecases/transaction/update-transaction'
import { LoadTransactionByIdRepository, UpdateTransactionRepository, UpdateTransaction } from './db-update-transaction-protocols'

export class DbUpdateTransaction implements UpdateTransaction {
  constructor (private readonly updateTransactionRepository: UpdateTransactionRepository,
    private readonly loadTransactionByIdRepository: LoadTransactionByIdRepository
  ) {}

  async update (transaction: TransactionEdit): Promise<TransactionModel | null> {
    this.loadTransactionByIdRepository.loadById(transaction.user_id)
    return null
  }
}
