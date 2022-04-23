import { LoadTransactionByIdRepository, DeleteTransaction, DeleteTransactionRepository } from './db-delete-transaction-protocols'

export class DbDeleteTransaction implements DeleteTransaction {
  constructor (private readonly deleteTransactionRepository: DeleteTransactionRepository,
    private readonly loadTransactionByIdRepository: LoadTransactionByIdRepository
  ) {}

  async delete (id: string): Promise<boolean> {
    const transaction = await this.loadTransactionByIdRepository.loadById(id)
    if (!transaction) return false
    await this.deleteTransactionRepository.delete(id)
    return true
  }
}
