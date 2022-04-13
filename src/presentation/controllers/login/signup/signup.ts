import { HttpRequest, HttpResponse, Controller } from './signup-protocols'
import { badRequest, forbidden, ok, serverError } from '../../../helpers/http/http'
import { UsernameInUseError, MissingParamError, LengthParamError } from '../../../errors'
import { AddAccount } from '../../../../domain/usecases/account/add-account'
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
      const accessToken = await this.addAccount.add({ username, password })
      if (!accessToken) return forbidden(new UsernameInUseError())
      return ok({ accessToken })
    } catch (error) {
      return serverError()
    }
  }
}
