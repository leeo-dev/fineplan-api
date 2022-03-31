import { badRequest } from '@/presentation/helpers/http/http'
export class SignUpController {
  handle (httpRequest: any): any {
    const { username, password } = httpRequest.body
    if (!username) return badRequest(new Error('MissingParam: username'))
    if (!password) return badRequest(new Error('MissingParam: password'))
  }
}
