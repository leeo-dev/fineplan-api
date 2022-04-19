import { AddTransaction, TransactionParam } from './../../../../domain/usecases/transaction/add-transaction'
import { LengthParamError, MissingParamError, InvalidParamError } from '../../../errors'
import { DepositController } from './deposit-controller'
import { badRequest, noContent } from './../../../helpers/http/http'
import { expect, test, describe, jest, beforeAll, afterAll } from '@jest/globals'
import MockDate from 'mockdate'
const mockAddTransaction = (): AddTransaction => {
  class AddTransactionStub implements AddTransaction {
    async add (data: TransactionParam): Promise<void> {

    }
  }
  return new AddTransactionStub()
}

type SutTypes = {
  sut: DepositController
  addTransactionStub: AddTransaction
}

const makeSut = (): SutTypes => {
  const addTransactionStub = mockAddTransaction()
  const sut = new DepositController(addTransactionStub)
  return { sut, addTransactionStub }
}

const mockTransaction = (type: string): TransactionParam => ({
  title: 'any_title',
  amount: type === 'deposit' ? 250 : -250,
  date: new Date('2020-05-05'),
  type,
  user_id: 'any_id'
})

describe('Deposit Controller', () => {
  beforeAll(() => { MockDate.set(new Date()) })
  afterAll(() => { MockDate.reset() })
  test('Should return 400 if no title is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        amount: 'any_amount',
        date: 'any_date'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('title')))
  })
  test('Should return 400 if no amount is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        title: 'any_title',
        date: 'any_date'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('amount')))
  })
  test('Should return 400 if no date is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        title: 'any_title',
        amount: 'any_amount'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('date')))
  })
  test('Should return 400 if length of title is not between 3 and 25 characters', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        title: 'an',
        amount: 'any_amount',
        date: 'any_date'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new LengthParamError('title', 3, 25)))
  })
  test('Should return 400 if amount is not a number', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        title: 'any_title',
        amount: 'invalid_type',
        date: 'any_date'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('amount')))
  })
  test('Should return 400 if amount less or equal than zero', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        title: 'any_title',
        amount: '0',
        date: 'any_date'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('amount')))
  })
  test('Should return 400 if amount less or equal than zero', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        title: 'any_title',
        amount: '250',
        date: 'any_date'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('date')))
  })
  test('Should call AddTransaction with correct values', async () => {
    const { sut, addTransactionStub } = makeSut()
    const addSpy = jest.spyOn(addTransactionStub, 'add')
    const httpRequest = {
      body: {
        title: 'any_title',
        amount: 250,
        date: new Date('2020-05-05')
      },
      user: {
        id: 'any_id'
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(mockTransaction('deposit'))
  })
  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        title: 'any_title',
        amount: 250,
        date: '2020-05-05'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(noContent())
  })
})
