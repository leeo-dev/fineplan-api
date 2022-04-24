import { TransactionModel } from '../../../../domain/models/transaction'
import { TransactionEdit } from '../../../../domain/usecases/transaction/update-transaction'
import { LoadTransactionByIdRepository, UpdateTransactionRepository, UpdateTransaction } from './db-update-transaction-protocols'

export class DbUpdateTransaction implements UpdateTransaction {
  constructor (private readonly updateTransactionRepository: UpdateTransactionRepository,
    private readonly loadTransactionByIdRepository: LoadTransactionByIdRepository
  ) {}

  async update (transaction: TransactionEdit): Promise<TransactionModel | null> {
    const isValid = await this.loadTransactionByIdRepository.loadById(transaction.user_id)
    if (!isValid) return null
    await this.updateTransactionRepository.update(transaction)
    return null
  }
}
