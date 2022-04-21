import { LoadTransactionsController } from './load-transactions'
import { TransactionModel } from './../../../../domain/models/transaction'
import { LoadTransactions } from './../../../../domain/usecases/transaction/load-transactions'
import { expect, test, describe, jest } from '@jest/globals'

const mockLoadTransactions = (): LoadTransactions => {
  class LoadTransactionsStub implements LoadTransactions {
    async loadAll (userId: string): Promise<TransactionModel[]> {
      return []
    }
  }
  return new LoadTransactionsStub()
}

type SutTypes = {
  sut: LoadTransactionsController
  loadTransactionsStub: LoadTransactions
}

const makeSut = (): SutTypes => {
  const loadTransactionsStub = mockLoadTransactions()
  const sut = new LoadTransactionsController(loadTransactionsStub)
  return { sut, loadTransactionsStub }
}

describe('LoadTransactions Controller', () => {
  test('Should call LoadTransactions with correct user id', async () => {
    const { sut, loadTransactionsStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadTransactionsStub, 'loadAll')
    await sut.handle({ user: { id: 'any_id' } })
    expect(loadAllSpy).toHaveBeenCalledWith('any_id')
  })
})
