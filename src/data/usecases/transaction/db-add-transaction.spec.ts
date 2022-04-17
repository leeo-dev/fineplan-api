import { DbAddTransaction } from './db-add-transaction'
import { TransactionParam } from './../../../domain/usecases/transaction/add-transaction'
import { AddTransactionRepository } from '../../protocols/add-transaction-repository'
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

describe('DbAddTransaction UseCase', () => {
  beforeAll(() => { MockDate.set(new Date()) })
  afterAll(() => { MockDate.reset() })
  test('Should call TransactionMongoRepository with correct values', async () => {
    const { sut, addTransactionRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addTransactionRepositoryStub, 'add')
    await sut.add({ title: 'any_name', amount: 250, date: new Date('2020-05-05'), created_at: new Date() })
    expect(addSpy).toHaveBeenCalledWith({ title: 'any_name', amount: 250, date: new Date('2020-05-05'), created_at: new Date() })
  })
})
