import { badRequest } from '@/presentation/helpers/http/http'
import { MissingParamError } from '@/presentation/errors/missing-param-error'
export class SignUpController {
  handle (httpRequest: any): any {
    const { username, password } = httpRequest.body
    if (!username) return badRequest(new MissingParamError('username'))
    if (!password) return badRequest(new MissingParamError('password'))
  }
}
