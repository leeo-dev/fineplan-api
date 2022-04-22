import { LoginController } from './login-controller'
import { Validation, AddAccountParams, Authentication } from './login-controller-protocols'
import { MissingParamError } from './../../../errors/missing-param-error'
import { badRequest, ok, unauthorized } from '../../../helpers/http/http'
import { expect, test, describe, jest } from '@jest/globals'

const mockValidationComposite = (): Validation => {
  class ValidationComposite implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationComposite()
}

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
  validationCompositeStub: Validation
}

const makeSut = (): SutTypes => {
  const validationCompositeStub = mockValidationComposite()
  const authenticationStub = mockAuthentication()
  const sut = new LoginController(authenticationStub, validationCompositeStub)
  return { sut, authenticationStub, validationCompositeStub }
}

describe('Login Controller', () => {
  test('Should call Validation Composite with correct values', async () => {
    const { sut, validationCompositeStub } = makeSut()
    const compositeSpy = jest.spyOn(validationCompositeStub, 'validate')
    const httpRequest = {
      body: {
        username: 'any_username',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(compositeSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should return an error if Validation Composite fails', async () => {
    const { sut, validationCompositeStub } = makeSut()
    jest.spyOn(validationCompositeStub, 'validate').mockReturnValueOnce(new MissingParamError('username'))
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('username')))
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
