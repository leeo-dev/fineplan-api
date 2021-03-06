import { TransactionModel } from '../../../../domain/models/transaction'
import { TransactionEdit } from '../../../../domain/usecases/transaction/update-transaction'
import { LoadTransactionByIdRepository, UpdateTransactionRepository, UpdateTransaction } from './db-update-transaction-protocols'

export class DbUpdateTransaction implements UpdateTransaction {
  constructor (private readonly updateTransactionRepository: UpdateTransactionRepository,
    private readonly loadTransactionByIdRepository: LoadTransactionByIdRepository
  ) {}

  async update (transaction: TransactionEdit): Promise<TransactionModel | null> {
    const isValid = await this.loadTransactionByIdRepository.loadById(transaction.id)
    if (!isValid) return null
    const updatedTransaction = await this.updateTransactionRepository.update(transaction)
    return updatedTransaction
  }
}
