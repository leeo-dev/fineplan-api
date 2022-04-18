import { forbidden, ok } from './../helpers/http/http'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'
import { AccessDeniedError } from '../errors/access-denied-error'
import { LoadAccountIdByAccessToken } from './../../domain/usecases/account/load-account-id-by-access-token'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountIdByAccessToken: LoadAccountIdByAccessToken) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (!accessToken) return forbidden(new AccessDeniedError())
    const id = await this.loadAccountIdByAccessToken.loadById(accessToken)
    if (!id) return forbidden(new AccessDeniedError())
    return ok({ accountId: id })
  }
}
