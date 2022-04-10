import { unauthorized } from './../../../helpers/http/http'
import { Controller, HttpRequest, HttpResponse } from './login-protocols'
import { MissingParamError } from '../../../errors'
import { badRequest, ok } from '../../../helpers/http/http'
import { Authentication } from './../../../../domain/usecases/account/authentication'

export class LoginController implements Controller {
  constructor (private readonly authentication: Authentication) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['username', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const { username, password } = httpRequest.body
    const accessToken = await this.authentication.auth({ username, password })
    if (!accessToken) return unauthorized()
    return ok({ accessToken })
  }
}
