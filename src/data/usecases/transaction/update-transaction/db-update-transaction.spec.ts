import { DbUpdateTransaction } from './db-update-transaction'
import { LoadTransactionByIdRepository, TransactionEdit, TransactionModel, UpdateTransactionRepository } from './db-update-transaction-protocols'
import { expect, test, describe, jest, afterAll, beforeAll } from '@jest/globals'
import MockDate from 'mockdate'

const mockTransactionModel = (type: string): TransactionModel => ({
  id: 'any_id',
  title: 'any_title',
  amount: type === 'deposit' ? 250 : -250,
  date: new Date('2020-05-05'),
  type,
  user_id: 'any_id',
  created_at: new Date()
})
const mockTransactionEdit = (type: string): TransactionEdit => ({
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
  beforeAll(() => { MockDate.set(new Date()) })
  afterAll(() => { MockDate.reset() })
  test('Should call LoadTransactionByIdRepository with correct id', async () => {
    const { sut, loadTransactionByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadTransactionByIdRepositoryStub, 'loadById')
    await sut.update(mockTransactionEdit('deposit'))
    expect(loadByIdSpy).toHaveBeenCalledWith(mockTransactionEdit('deposit').user_id)
  })
  test('Should return null if LoadTransactionByIdRepository return false', async () => {
    const { sut, loadTransactionByIdRepositoryStub } = makeSut()
    jest.spyOn(loadTransactionByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.resolve(false))
    const updatedTransaction = await sut.update(mockTransactionEdit('deposit'))
    expect(updatedTransaction).toBeFalsy()
  })
  test('Should call UpdateTransaction With correct values', async () => {
    const { sut, updateTransactionRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateTransactionRepositoryStub, 'update')
    await sut.update(mockTransactionEdit('deposit'))
    expect(updateSpy).toHaveBeenCalledWith(mockTransactionEdit('deposit'))
  })
  test('Should returns an updated transaction on success', async () => {
    const { sut } = makeSut()
    const updatedTransaction = await sut.update(mockTransactionEdit('deposit'))
    expect(updatedTransaction).toEqual(mockTransactionModel('deposit'))
  })
})
