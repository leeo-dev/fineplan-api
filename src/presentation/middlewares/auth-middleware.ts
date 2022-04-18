import { forbidden, ok, serverError } from './../helpers/http/http'
import { Middleware, HttpRequest, HttpResponse, LoadAccountByAccessToken } from './auth-middleware-protocols'
import { AccessDeniedError } from '../errors/access-denied-error'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByAccessToken: LoadAccountByAccessToken) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (!accessToken) return forbidden(new AccessDeniedError())
      const account = await this.loadAccountByAccessToken.loadIdByAccessToken(accessToken)
      if (!account) return forbidden(new AccessDeniedError())
      return ok(account)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
