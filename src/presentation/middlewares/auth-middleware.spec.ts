import { AccountModel } from './../../domain/models/account'
import { AuthMiddleware } from './auth-middleware'
import { HttpRequest, LoadAccountByAccessToken } from './auth-middleware-protocols'
import { forbidden, ok, serverError } from '../helpers/http/http'
import { AccessDeniedError } from '../errors'
import { expect, test, describe, jest } from '@jest/globals'

const mockAccount = (): AccountModel => ({
  id: 'any_id',
  username: 'any_username',
  password: 'any_password'
})

const mockHttpRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

const mockLoadAccountIdByAccessToken = (): LoadAccountByAccessToken => {
  class LoadAccountIdByAccessTokenStub implements LoadAccountByAccessToken {
    async loadIdByAccessToken (accessToken: string): Promise<AccountModel | null> {
      return await Promise.resolve(mockAccount())
    }
  }

  return new LoadAccountIdByAccessTokenStub()
}

type SutTypes = {
  sut: AuthMiddleware
  loadAccountIdByAccessTokenStub: LoadAccountByAccessToken
}

const makeSut = (): SutTypes => {
  const loadAccountIdByAccessTokenStub = mockLoadAccountIdByAccessToken()
  const sut = new AuthMiddleware(loadAccountIdByAccessTokenStub)
  return { sut, loadAccountIdByAccessTokenStub }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token is exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Should call LoadAccountIdByAccessToken with correct accessToken', async () => {
    const { sut, loadAccountIdByAccessTokenStub } = makeSut()
    const spyLoadById = jest.spyOn(loadAccountIdByAccessTokenStub, 'loadIdByAccessToken')
    await sut.handle(mockHttpRequest())
    expect(spyLoadById).toHaveBeenCalledWith(mockHttpRequest().headers['x-access-token'])
  })
  test('Should call LoadAccountIdByAccessToken with correct accessToken', async () => {
    const { sut, loadAccountIdByAccessTokenStub } = makeSut()
    const spyLoadById = jest.spyOn(loadAccountIdByAccessTokenStub, 'loadIdByAccessToken')
    await sut.handle(mockHttpRequest())
    expect(spyLoadById).toHaveBeenCalledWith(mockHttpRequest().headers['x-access-token'])
  })
  test('Should return 403 if LoadAccountIdByAccessToken returns null', async () => {
    const { sut, loadAccountIdByAccessTokenStub } = makeSut()
    jest.spyOn(loadAccountIdByAccessTokenStub, 'loadIdByAccessToken').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Should return 200 if LoadAccountIdByAccessToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(ok({ user: { id: mockAccount().id } }))
  })
  test('Should return 500 if LoadAccountIdByAccessToken throws', async () => {
    const { sut, loadAccountIdByAccessTokenStub } = makeSut()
    jest.spyOn(loadAccountIdByAccessTokenStub, 'loadIdByAccessToken').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
