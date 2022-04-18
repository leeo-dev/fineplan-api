import { forbidden, ok, serverError } from './../helpers/http/http'
import { Middleware, HttpRequest, HttpResponse, LoadAccountIdByAccessToken } from './auth-middleware-protocols'
import { AccessDeniedError } from '../errors/access-denied-error'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountIdByAccessToken: LoadAccountIdByAccessToken) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (!accessToken) return forbidden(new AccessDeniedError())
      const id = await this.loadAccountIdByAccessToken.loadById(accessToken)
      if (!id) return forbidden(new AccessDeniedError())
      return ok({ accountId: id })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
