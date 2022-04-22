import { LoadTransactionsRepository } from './../../../protocols/transaction/load-transactions'
import { TransactionModel } from '@/domain/models/transaction'
import { LoadTransactions } from './../../../../domain/usecases/transaction/load-transactions'
export class DbLoadTransactions implements LoadTransactions {
  constructor (private readonly loadTransactionsRepository: LoadTransactionsRepository) {}
  async loadAll (userId: string): Promise<TransactionModel[]> {
    const transactions = await this.loadTransactionsRepository.loadAll(userId)
    return transactions
  }
}
