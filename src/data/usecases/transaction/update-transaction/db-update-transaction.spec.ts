import { DbUpdateTransaction } from './db-update-transaction'
import { LoadTransactionByIdRepository, TransactionEdit, TransactionModel, UpdateTransactionRepository } from './db-update-transaction-protocols'
import { expect, test, describe, jest } from '@jest/globals'

const mockTransactionModel = (type: string): TransactionModel => ({
  id: 'any_id',
  title: 'any_title',
  amount: type === 'deposit' ? 250 : -250,
  date: new Date('2020-05-05'),
  type,
  user_id: 'any_id',
  created_at: new Date()
})
const transactionEdit = (type: string): TransactionEdit => ({
  id: 'any_id',
  title: 'any_title',
  amount: type === 'deposit' ? 250 : -250,
  date: new Date('2020-05-05'),
  type,
  user_id: 'any_id'
})

const mockUpdateTransactionRepository = (): UpdateTransactionRepository => {
  class DeleteTransactionRepositoryStub implements UpdateTransactionRepository {
    async update (transactionEditParams: TransactionEdit): Promise<TransactionModel> {
      return await Promise.resolve(mockTransactionModel('deposit'))
    }
  }
  return new DeleteTransactionRepositoryStub()
}

const mockLoadTransactionByIdRepository = (): LoadTransactionByIdRepository => {
  class DeleteTransactionRepositoryStub implements LoadTransactionByIdRepository {
    async loadById (id: string): Promise<boolean> {
      return true
    }
  }
  return new DeleteTransactionRepositoryStub()
}

type SutTypes = {
  sut: DbUpdateTransaction
  updateTransactionRepositoryStub: UpdateTransactionRepository
  loadTransactionByIdRepositoryStub: LoadTransactionByIdRepository
}

const makeSut = (): SutTypes => {
  const updateTransactionRepositoryStub = mockUpdateTransactionRepository()
  const loadTransactionByIdRepositoryStub = mockLoadTransactionByIdRepository()
  const sut = new DbUpdateTransaction(updateTransactionRepositoryStub, loadTransactionByIdRepositoryStub)
  return { sut, updateTransactionRepositoryStub, loadTransactionByIdRepositoryStub }
}

describe('DbDeleteTransaction', () => {
  test('Should call LoadTransactionByIdRepository with correct id', async () => {
    const { sut, loadTransactionByIdRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(loadTransactionByIdRepositoryStub, 'loadById')
    await sut.update(transactionEdit('deposit'))
    expect(updateSpy).toHaveBeenCalledWith(transactionEdit('deposit').user_id)
  })
})
