import { AuthMiddleware } from './auth-middleware'
import { HttpRequest, LoadAccountIdByAccessToken } from './auth-middleware-protocols'
import { forbidden, ok, serverError } from '../helpers/http/http'
import { AccessDeniedError } from '../errors'
import { expect, test, describe, jest } from '@jest/globals'

const mockHttpRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

const mockLoadAccountIdByAccessToken = (): LoadAccountIdByAccessToken => {
  class LoadAccountIdByAccessTokenStub implements LoadAccountIdByAccessToken {
    async loadById (accessToken: string): Promise<string | null> {
      return await Promise.resolve('any_id')
    }
  }

  return new LoadAccountIdByAccessTokenStub()
}

type SutTypes = {
  sut: AuthMiddleware
  loadAccountIdByAccessTokenStub: LoadAccountIdByAccessToken
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
    const spyLoadById = jest.spyOn(loadAccountIdByAccessTokenStub, 'loadById')
    await sut.handle(mockHttpRequest())
    expect(spyLoadById).toHaveBeenCalledWith(mockHttpRequest().headers['x-access-token'])
  })
  test('Should call LoadAccountIdByAccessToken with correct accessToken', async () => {
    const { sut, loadAccountIdByAccessTokenStub } = makeSut()
    const spyLoadById = jest.spyOn(loadAccountIdByAccessTokenStub, 'loadById')
    await sut.handle(mockHttpRequest())
    expect(spyLoadById).toHaveBeenCalledWith(mockHttpRequest().headers['x-access-token'])
  })
  test('Should return 403 if LoadAccountIdByAccessToken returns null', async () => {
    const { sut, loadAccountIdByAccessTokenStub } = makeSut()
    jest.spyOn(loadAccountIdByAccessTokenStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Should return 200 if LoadAccountIdByAccessToken returns an id', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'any_id' }))
  })
  test('Should return 500 if LoadAccountIdByAccessToken throws', async () => {
    const { sut, loadAccountIdByAccessTokenStub } = makeSut()
    jest.spyOn(loadAccountIdByAccessTokenStub, 'loadById').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
