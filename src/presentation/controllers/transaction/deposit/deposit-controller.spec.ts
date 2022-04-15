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
        title: 'any_title',
        amount: 'any_title',
        date: 'any_date'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('title')))
  })
})
