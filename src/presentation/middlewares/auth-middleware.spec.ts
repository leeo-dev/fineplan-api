import { AuthMiddleware } from './auth-middleware'
import { HttpRequest } from './../protocols/http'
import { forbidden } from '../helpers/http/http'
import { AccessDeniedError } from '../errors/access-denied-error'
import { LoadAccountIdByAccessToken } from './../../domain/usecases/account/load-account-id-by-access-token'
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
})
