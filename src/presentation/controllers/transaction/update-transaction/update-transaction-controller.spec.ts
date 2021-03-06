import { UpdateTransactionController } from './update-transaction-controller'
import { Validation, UpdateTransaction, HttpRequest, TransactionEdit, TransactionModel } from './update-transaction-controller-protocols'
import { MissingParamError } from './../../../errors'
import { badRequest, notFound, serverError, ok } from './../../../helpers/http/http'
import { expect, test, describe, jest, beforeAll, afterAll } from '@jest/globals'
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

const mockHttpRequest = (): HttpRequest => ({
  body: {
    title: 'any_title',
    type: 'any_type',
    amount: 250,
    date: new Date()
  },
  user: {
    id: 'any_user_id'
  },
  params: {
    id: 'any_transaction_id'
  }
})

const mockUpdateTransaction = (): UpdateTransaction => {
  class UpdateTransactionStub implements UpdateTransaction {
    async update (transaction: TransactionEdit): Promise<TransactionModel | null> {
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
  beforeAll(() => { MockDate.set(new Date()) })
  afterAll(() => { MockDate.reset() })
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
  test('Should call UpdateTransaction with correct values', async () => {
    const { sut, updateTransactionStub } = makeSut()
    const updateSpy = jest.spyOn(updateTransactionStub, 'update')
    await sut.handle(mockHttpRequest())
    expect(updateSpy).toHaveBeenCalledWith({
      id: 'any_transaction_id',
      title: 'any_title',
      type: 'any_type',
      amount: 250,
      date: new Date(),
      user_id: 'any_user_id'
    })
  })
  test('Should return 404 if returns null', async () => {
    const { sut, updateTransactionStub } = makeSut()
    jest.spyOn(updateTransactionStub, 'update').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(notFound(new MissingParamError('id')))
  })
  test('Should return 500 if UpdateTransaction throws', async () => {
    const { sut, updateTransactionStub } = makeSut()
    jest.spyOn(updateTransactionStub, 'update').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(ok(mockTransactionModel('deposit')))
  })
  test('Should return 400 if no params is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ })
    expect(httpResponse).toEqual(badRequest(new MissingParamError('user_id')))
  })
})
