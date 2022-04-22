import { TransactionModel } from './../../../../domain/models/transaction'
import { LoadTransactionsRepository } from '../../../protocols/transaction/load-transactions'
import MockDate from 'mockdate'
import { expect, test, describe, jest, beforeAll, afterAll } from '@jest/globals'
import { DbALoadTransactions } from './db-load-transactions'

const mockTransactions = (): TransactionModel[] => ([
  { id: 'any_id', title: 'any_title', amount: -250, date: new Date(), type: 'withdraw', created_at: new Date(), user_id: 'any_user_id' },
  { id: 'any_id', title: 'any_title', amount: 1200, date: new Date(), type: 'deposit', created_at: new Date(), user_id: 'any_user_id' }
])

const mockLoadTransactionsRepository = (): LoadTransactionsRepository => {
  class TransactionRepositoryStub implements LoadTransactionsRepository {
    async loadAll (userId: string): Promise<TransactionModel[]> {
      return await Promise.resolve(mockTransactions())
    }
  }
  return new TransactionRepositoryStub()
}

type SutTypes = {
  sut: DbALoadTransactions
  loadTransactionsRepositoryStub: LoadTransactionsRepository
}

const makeSut = (): SutTypes => {
  const loadTransactionsRepositoryStub = mockLoadTransactionsRepository()
  const sut = new DbALoadTransactions(loadTransactionsRepositoryStub)
  return { sut, loadTransactionsRepositoryStub }
}

describe('DbLoadTransactions UseCase', () => {
  beforeAll(() => { MockDate.set(new Date()) })
  afterAll(() => { MockDate.reset() })

  test('Should call LoadTransactionsRepository with correct id', async () => {
    const { sut, loadTransactionsRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadTransactionsRepositoryStub, 'loadAll')
    await sut.loadAll('any_id')
    expect(loadAllSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should return a list of Transactions on success', async () => {
    const { sut } = makeSut()
    const transactions = await sut.loadAll('any_id')
    expect(transactions).toEqual(mockTransactions())
  })
})
