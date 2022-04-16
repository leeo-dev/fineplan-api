import { badRequest } from './../../../helpers/http/http'
import { HttpRequest, HttpResponse } from '../../login/signup/signup-protocols'
import { Controller } from './../../../protocols/controller'
import { InvalidParamError, LengthParamError, MissingParamError } from '@/presentation/errors'
export class DepositController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['title', 'date', 'amount']
    for (const field of requiredFields) {
      const lengthField = httpRequest.body[field]?.length
      if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      if (field === 'amount') break
      if (lengthField < 3 || lengthField > 25) return badRequest(new LengthParamError(field, 3, 25))
    }

    const { amount } = httpRequest.body

    const isInvalidAmount = isNaN(amount)
    if (isInvalidAmount || amount <= 0) return badRequest(new InvalidParamError('amount'))

    return {
      statusCode: 200,
      body: {}
    }
  }
}
