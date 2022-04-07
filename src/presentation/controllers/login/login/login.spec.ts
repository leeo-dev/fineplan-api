import { expect, test, describe } from '@jest/globals'
import { LoginController } from './login'
import { MissingParamError } from '../../../errors'

type SutTypes = {
  sut: LoginController
}

const makeSut = (): SutTypes => {
  const sut = new LoginController()
  return { sut }
}

describe('Login Controller', () => {
  test('should Login Controller returns 400 if no username is provided ', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('username'))
  })
  test('should Login Controller returns 400 if no password is provided ', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'any_username'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
})
