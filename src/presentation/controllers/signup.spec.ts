import { MissingParamError } from '@/presentation/errors/missing-param-error'
import { LengthParamError } from '@/presentation/errors/length-param-error'
import { SignUpController } from '@/presentation/controllers/signup'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'
const mockAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (accountParams: AddAccountParams): Promise<string | null> {
      return await Promise.resolve('valid_id')
    }
  }

  return new AddAccountStub()
}

type SutType = {
  sut: SignUpController
  addAccountStub: AddAccount
}

const makeSut = (): SutType => {
  const addAccountStub = mockAccount()
  const sut = new SignUpController(addAccountStub)
  return { sut, addAccountStub }
}

describe('SignUp Controller', () => {
  test('should SignUp Controller returns 400 if no username is provided ', async () => {
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
  test('should SignUp Controller returns 400 if no password is provided ', async () => {
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
  test('should SignUp Controller returns 400 if username is less than 3 or more than 25 character ', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'an',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new LengthParamError('username', 3, 25))
  })
  test('should SignUp Controller returns 400 if password is less than 3 or more than 25 character ', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'any_username',
        password: 'an'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new LengthParamError('password', 3, 25))
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
})
