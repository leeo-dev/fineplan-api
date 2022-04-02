import { MissingParamError } from '@/presentation/errors/missing-param-error'
import { LengthParamError } from '@/presentation/errors/length-param-error'
import { SignUpController } from '@/presentation/controllers/signup'

type SutType = {
  sut: SignUpController
}

const makeSut = (): SutType => {
  const sut = new SignUpController()
  return { sut }
}

describe('SignUp Controller', () => {
  test('should SignUp Controller returns 400 if no username is provided ', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('username'))
  })
  test('should SignUp Controller returns 400 if no password is provided ', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'any_username'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  test('should SignUp Controller returns 400 if username is less than 3 or more than 25 character ', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'an',
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new LengthParamError('username', 3, 25))
  })
  test('should SignUp Controller returns 400 if password is less than 3 or more than 25 character ', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'any_username',
        password: 'an'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new LengthParamError('password', 3, 25))
  })
})
