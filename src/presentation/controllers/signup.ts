import { badRequest } from '@/presentation/helpers/http/http'
export class SignUpController {
  handle (httpRequest: any): any {
    const { username, password } = httpRequest.body
    if (!username) return badRequest()
    if (!password) return badRequest()
  }
}
