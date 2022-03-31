import { MissingParamError } from '@/presentation/errors/missing-param-error'
import { SignUpController } from '@/presentation/controllers/signup'

type SutType = {
  sut: SignUpController
}

const makeSut = (): SutType => {
  const sut = new SignUpController()
  return { sut }
}

describe('SignUp Controller', () => {
  test('ensure SignUp Controller returns 400 if no username is provided ', () => {
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
  test('ensure SignUp Controller returns 400 if no password is provided ', () => {
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
})
