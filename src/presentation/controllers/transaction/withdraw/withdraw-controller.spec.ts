import { Validation } from './../../../protocols/validation'
import { WithdrawController } from './withdraw-controller'
import { AddTransaction, TransactionParam } from './withdraw-controller-protocols'
import { MissingParamError } from '../../../errors'
import { badRequest, forbidden, noContent } from './../../../helpers/http/http'
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
  test('Should call Validation Withdraw with correct values', async () => {
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
  test('Should return 400 if  ValidationComposite fails', async () => {
    const { sut, validationCompositeStub } = makeSut()
    jest.spyOn(validationCompositeStub, 'validate').mockReturnValueOnce(new MissingParamError('title'))
    const httpRequest = {
      body: {
        amount: 250,
        date: '2020-05-05'
      },
      user: {
        id: 'any_id'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('title')))
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
  test('Should return 403 if no id is provided', async () => {
    const { sut, addTransactionStub } = makeSut()
    jest.spyOn(addTransactionStub, 'add')
    const httpRequest = {
      body: {
        title: 'any_title',
        amount: 250,
        date: '2020-05-05'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new MissingParamError('id')))
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
