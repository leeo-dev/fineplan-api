import { AddTransactionRepository } from './../../protocols/add-transaction-repository'
import { AddTransaction, TransactionParam } from './../../../domain/usecases/transaction/add-transaction'
export class DbAddTransaction implements AddTransaction {
  constructor (private readonly addTransactionRepository: AddTransactionRepository) {}
  async add (data: TransactionParam): Promise<void> {
    const transaction = Object.assign({}, data, { created_at: new Date() })
    await this.addTransactionRepository.add(transaction)
  }
}
