import { Controller, HttpRequest, HttpResponse } from './login-protocols'
import { badRequest, ok } from '../../../helpers/http/http'
import { MissingParamError } from '../../../errors'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['username', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    return ok('')
  }
}
