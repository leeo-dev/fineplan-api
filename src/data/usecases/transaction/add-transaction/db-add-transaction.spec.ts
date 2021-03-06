import { DbAddTransaction } from './db-add-transaction'
import { TransactionParam, AddTransactionRepository } from './db-add-transaction-protocols'
import { expect, test, describe, jest, beforeAll, afterAll } from '@jest/globals'
import MockDate from 'mockdate'

const mockAddTransactionRepository = (): AddTransactionRepository => {
  class TransactionRepositoryStub implements AddTransactionRepository {
    async add (transactionData: TransactionParam): Promise<void> {}
  }
  return new TransactionRepositoryStub()
}

type SutTypes = {
  sut: DbAddTransaction
  addTransactionRepositoryStub: AddTransactionRepository
}

const makeSut = (): SutTypes => {
  const addTransactionRepositoryStub = mockAddTransactionRepository()
  const sut = new DbAddTransaction(addTransactionRepositoryStub)
  return { sut, addTransactionRepositoryStub }
}

const mockTransaction = (type: string): TransactionParam => ({
  title: 'any_name',
  amount: 250,
  date: new Date('2020-05-05'),
  created_at: new Date(),
  type,
  user_id: 'any_id'
})

describe('DbAddTransaction UseCase', () => {
  beforeAll(() => { MockDate.set(new Date()) })
  afterAll(() => { MockDate.reset() })
  test('Should call TransactionMongoRepository with correct values', async () => {
    const { sut, addTransactionRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addTransactionRepositoryStub, 'add')
    await sut.add(mockTransaction('deposit'))
    expect(addSpy).toHaveBeenCalledWith(mockTransaction('deposit'))
  })
  test('Should throws if AddTransactionRepository throws', async () => {
    const { sut, addTransactionRepositoryStub } = makeSut()
    jest.spyOn(addTransactionRepositoryStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.add(mockTransaction('deposit'))
    await expect(promise).rejects.toThrow()
  })
})
