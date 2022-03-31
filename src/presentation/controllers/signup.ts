import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { Controller } from '@/presentation/protocols/controller'
import { badRequest } from '@/presentation/helpers/http/http'
import { MissingParamError } from '@/presentation/errors/missing-param-error'
export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const { username, password } = httpRequest.body
    if (!username) return badRequest(new MissingParamError('username'))
    if (!password) return badRequest(new MissingParamError('password'))
    return {
      statusCode: 200,
      body: ''
    }
  }
}
