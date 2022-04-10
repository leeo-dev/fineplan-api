import { LoginController } from './login'
import { ok, unauthorized } from '../../../helpers/http/http'
import { MissingParamError } from '../../../errors'
import { AddAccountParams } from './../../../../domain/usecases/account/add-account'
import { Authentication } from './../../../../domain/usecases/account/authentication'
import { expect, test, describe, jest } from '@jest/globals'

const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (data: AddAccountParams): Promise<string | null> {
      return await Promise.resolve('any_token')
    }
  }
  return new AuthenticationStub()
}

type SutTypes = {
  sut: LoginController
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication()
  const sut = new LoginController(authenticationStub)
  return { sut, authenticationStub }
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

  test('should Login Controller calls Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const addSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = {
      body: {
        username: 'any_username',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should Login Controller calls Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const addSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = {
      body: {
        username: 'any_username',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should Login Controller returns 401 if invalid credential is provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null))
    const httpRequest = {
      body: {
        username: 'any_username',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should LoginController return an access token on success', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'any_username',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
})