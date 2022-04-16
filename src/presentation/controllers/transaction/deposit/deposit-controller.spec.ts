import { LengthParamError, MissingParamError, InvalidParamError } from '@/presentation/errors'
import { DepositController } from './deposit-controller'
import { badRequest } from './../../../helpers/http/http'
import { expect, test, describe } from '@jest/globals'

// Title
// amount
// date
// created_at

type SutTypes = {
  sut: DepositController
}

const makeSut = (): SutTypes => {
  const sut = new DepositController()
  return { sut }
}

describe('Deposit Controller', () => {
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
})
