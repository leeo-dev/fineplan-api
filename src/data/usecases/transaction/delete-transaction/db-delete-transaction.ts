import { DeleteTransactionRepository } from './../../../protocols/transaction/delete-transaction-repository'
import { DeleteTransaction } from './../../../../domain/usecases/transaction/delete-transaction'
export class DbDeleteTransaction implements DeleteTransaction {
  constructor (private readonly deleteTransactionRepository: DeleteTransactionRepository) {}
  async delete (id: string): Promise<void> {
    await this.deleteTransactionRepository.delete(id)
  }
}
