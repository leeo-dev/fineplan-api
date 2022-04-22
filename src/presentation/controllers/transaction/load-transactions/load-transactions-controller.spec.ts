import { LoadTransactionsController } from './load-transactions-controller'
import { TransactionModel, LoadTransactions } from './load-transactions-controller-protocols'
import { AccessDeniedError } from './../../../errors/access-denied-error'
import { ok, noContent, serverError, forbidden } from './../../../helpers/http/http'
import MockDate from 'mockdate'
import { expect, test, describe, jest, beforeAll, afterAll } from '@jest/globals'

const mockTransactions = (): TransactionModel[] => ([
  { id: 'any_id', title: 'any_title', amount: -250, date: new Date(), type: 'withdraw', created_at: new Date(), user_id: 'any_user_id' },
  { id: 'any_id', title: 'any_title', amount: 1200, date: new Date(), type: 'deposit', created_at: new Date(), user_id: 'any_user_id' }
])

const mockLoadTransactions = (): LoadTransactions => {
  class LoadTransactionsStub implements LoadTransactions {
    async loadAll (userId: string): Promise<TransactionModel[]> {
      return await Promise.resolve(mockTransactions())
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
  beforeAll(() => { MockDate.set(new Date()) })
  afterAll(() => { MockDate.reset() })
  test('Should call LoadTransactions with correct user id', async () => {
    const { sut, loadTransactionsStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadTransactionsStub, 'loadAll')
    await sut.handle({ user: { id: 'any_id' } })
    expect(loadAllSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ user: { id: 'any_id' } })
    expect(httpResponse).toEqual(ok(mockTransactions()))
  })
  test('Should return 403 if no user is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ })
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Should return 204 if LoadTransactions returns empty', async () => {
    const { sut, loadTransactionsStub } = makeSut()
    jest.spyOn(loadTransactionsStub, 'loadAll').mockReturnValueOnce(Promise.resolve([]))
    const httpResponse = await sut.handle({ user: { id: 'any_id' } })
    expect(httpResponse).toEqual(noContent())
  })
  test('Should return 500 if LoadTransactions throws', async () => {
    const { sut, loadTransactionsStub } = makeSut()
    jest.spyOn(loadTransactionsStub, 'loadAll').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle({ user: { id: 'any_id' } })
    await expect(httpResponse).toEqual(serverError(new Error()))
  })
})
