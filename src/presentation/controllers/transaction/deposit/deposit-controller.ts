import { MissingParamError } from './../../../errors/missing-param-error'
import { badRequest } from './../../../helpers/http/http'
import { HttpRequest, HttpResponse } from '../../login/signup/signup-protocols'
import { Controller } from './../../../protocols/controller'
export class DepositController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return badRequest(new MissingParamError('title'))
  }
}
