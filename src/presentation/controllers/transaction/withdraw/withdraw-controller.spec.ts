import { Validation } from './../../../protocols/validation'
import { WithdrawController } from './withdraw-controller'
import { AddTransaction, TransactionParam } from './withdraw-controller-protocols'
import { LengthParamError, MissingParamError, InvalidParamError } from '../../../errors'
import { badRequest, noContent } from './../../../helpers/http/http'
import { expect, test, describe, jest } from '@jest/globals'

const mockTransaction = (type: string): TransactionParam => ({
  title: 'any_title',
  amount: type === 'deposit' ? 250 : -250,
  date: new Date('2020-05-05'),
  type,
  user_id: 'any_id'
})

const mockAddTransaction = (): AddTransaction => {
  class AddTransactionStub implements AddTransaction {
    async add (data: TransactionParam): Promise<void> {

    }
  }
  return new AddTransactionStub()
}

const mockValidationComposite = (): Validation => {
  class ValidationComposite implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationComposite()
}

type SutTypes = {
  sut: WithdrawController
  addTransactionStub: AddTransaction
  validationCompositeStub: Validation

}

const makeSut = (): SutTypes => {
  const validationCompositeStub = mockValidationComposite()

  const addTransactionStub = mockAddTransaction()
  const sut = new WithdrawController(addTransactionStub, validationCompositeStub)
  return { sut, addTransactionStub, validationCompositeStub }
}

describe('Deposit Controller', () => {
  test('Should call Validation Composite with correct values', async () => {
    const { sut, validationCompositeStub } = makeSut()
    const validateSpy = jest.spyOn(validationCompositeStub, 'validate')
    const httpRequest = {
      body: {
        title: 'any_title',
        amount: 250,
        date: '2020-05-05'
      },
      user: {
        id: 'any_id'
      }
    }
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
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
        amount: '2345',
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
        date: '2020-05-05'
      },
      user: {
        id: 'any_id'
      }

    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(mockTransaction('withdraw'))
  })
  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        title: 'any_title',
        amount: 250,
        date: '2020-05-05'
      },
      user: {
        id: 'any_id'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(noContent())
  })
})
