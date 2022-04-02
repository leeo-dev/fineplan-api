import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { Controller } from '@/presentation/protocols/controller'
import { badRequest, forbidden, serverError } from '@/presentation/helpers/http/http'
import { UsernameInUseError } from '@/presentation/errors/username-in-use-error'
import { MissingParamError } from '@/presentation/errors/missing-param-error'
import { LengthParamError } from '../errors/length-param-error'
import { AddAccount } from '@/domain/usecases/account/add-account'
export class SignUpController implements Controller {
  constructor (private readonly addAccount: AddAccount) {}
  async handle (httpRequest: HttpRequest): Promise <HttpResponse> {
    try {
      const requiredFields = ['username', 'password']
      for (const field of requiredFields) {
        const lengthField = httpRequest.body[field]?.length
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
        if (lengthField < 3 || lengthField > 25) {
          return badRequest(new LengthParamError(field, 3, 25))
        }
      }
      const { username, password } = httpRequest.body
      const id = await this.addAccount.add({ username, password })
      if (!id) return forbidden(new UsernameInUseError())
      return {
        statusCode: 200,
        body: ''
      }
    } catch (error) {
      return serverError()
    }
  }
}
