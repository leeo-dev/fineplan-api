import { LengthParamError } from './../../../errors/length-param-error'
import { DepositController } from './deposit-controller'
import { MissingParamError } from './../../../errors/missing-param-error'
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
        accountId: 'any_id',
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
        accountId: 'any_id',
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
        accountId: 'any_id',
        title: 'any_title',
        amount: 'any_amount'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('date')))
  })
  test('Should return 400 if length of title is less than 3 character or more than 25 characters', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        accountId: 'any_id',
        title: 'an',
        amount: 'any_amount',
        date: 'any_date'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new LengthParamError('title', 3, 25)))
  })
})
