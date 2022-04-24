import { MissingParamError } from './../../../errors'
import { UpdateTransactionController } from './update-transaction-controller'
import { HttpRequest } from './../../../protocols/http'
import { badRequest } from './../../../helpers/http/http'
// import { TransactionParam } from './../../../../domain/usecases/transaction/add-transaction'
import { UpdateTransaction } from './../../../../domain/usecases/transaction/update-transaction'
import { Validation } from './../../../protocols/validation'
import { expect, test, describe, jest } from '@jest/globals'
import { TransactionModel } from '../load-transactions/load-transactions-controller-protocols'

// const mockTransaction = (type: string): TransactionParam => ({
//   title: 'any_title',
//   amount: type === 'deposit' ? 250 : -250,
//   date: new Date('2020-05-05'),
//   type,
//   user_id: 'any_id'
// })

const mockTransactionModel = (type: string): TransactionModel => ({
  id: 'any_id',
  title: 'any_title',
  amount: type === 'deposit' ? 250 : -250,
  date: new Date('2020-05-05'),
  type,
  user_id: 'any_id',
  created_at: new Date()
})

const mockHttpRequest = (): HttpRequest => ({
  body: {
    title: 'any_title',
    amount: 250,
    date: '2020-05-05'
  },
  user: {
    id: 'any_id'
  },
  params: {
    id: 'any_id'
  }
})

const mockUpdateTransaction = (): UpdateTransaction => {
  class UpdateTransactionStub implements UpdateTransaction {
    async update (transactionId: string, userId: string): Promise<TransactionModel | null> {
      return await Promise.resolve(mockTransactionModel('deposit'))
    }
  }
  return new UpdateTransactionStub()
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
  sut: UpdateTransactionController
  updateTransactionStub: UpdateTransaction
  validationCompositeStub: Validation
}

const makeSut = (): SutTypes => {
  const updateTransactionStub = mockUpdateTransaction()
  const validationCompositeStub = mockValidationComposite()
  const sut = new UpdateTransactionController(updateTransactionStub, validationCompositeStub)
  return { sut, updateTransactionStub, validationCompositeStub }
}

describe('Update Transaction', () => {
  test('Should call Validation Composite with correct values', async () => {
    const { sut, validationCompositeStub } = makeSut()
    const validateSpy = jest.spyOn(validationCompositeStub, 'validate')
    await sut.handle(mockHttpRequest())
    expect(validateSpy).toHaveBeenCalledWith(mockHttpRequest().body)
  })
  test('Should return 400 if  ValidationComposite fails', async () => {
    const { sut, validationCompositeStub } = makeSut()
    jest.spyOn(validationCompositeStub, 'validate').mockReturnValueOnce(new MissingParamError('title'))
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('title')))
  })
})
