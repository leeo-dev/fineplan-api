import { MissingParamError } from './../../../errors/missing-param-error'
import { badRequest } from './../../../helpers/http/http'
import { HttpRequest, HttpResponse } from '../../login/signup/signup-protocols'
import { Controller } from './../../../protocols/controller'
import { LengthParamError } from '@/presentation/errors'
export class DepositController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['title', 'amount', 'date']
    for (const field of requiredFields) {
      const lengthField = httpRequest.body[field]?.length
      if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      if (lengthField < 3 || lengthField > 25) return badRequest(new LengthParamError(field, 3, 25))
    }

    return {
      statusCode: 200,
      body: {}
    }
  }
}
