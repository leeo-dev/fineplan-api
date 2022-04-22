import { SignUpController } from './signup-controller'
import { AddAccount, AddAccountParams, Validation } from './signup-controller-protocols'
import { MissingParamError, UsernameInUseError } from '../../../../presentation/errors'
import { forbidden, serverError, ok, badRequest } from '../../../../presentation/helpers/http/http'
import { expect, test, describe, jest } from '@jest/globals'

const mockAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (accountParams: AddAccountParams): Promise<string | null> {
      return await Promise.resolve('valid_token')
    }
  }

  return new AddAccountStub()
}

const mockValidationComposite = (): Validation => {
  class ValidationComposite implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationComposite()
}

type SutType = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationCompositeStub: Validation
}

const makeSut = (): SutType => {
  const validationCompositeStub = mockValidationComposite()
  const addAccountStub = mockAccount()
  const sut = new SignUpController(addAccountStub, validationCompositeStub)
  return { sut, addAccountStub, validationCompositeStub }
}

describe('SignUp Controller', () => {
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
  test('should SignUp Controller calls AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        username: 'any_username',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('should SignUp Controller returns 403 if username is already in use', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await Promise.resolve(null)
    })
    const httpRequest = {
      body: {
        username: 'any_username',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new UsernameInUseError()))
  })
  test('should SignUp Controller returns 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        username: 'any_username',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('should SignUp Controller returns 200 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'any_username',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: 'valid_token' }))
  })
})
