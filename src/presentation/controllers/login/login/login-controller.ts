import { Controller, HttpRequest, HttpResponse, Validation, Authentication } from './login-controller-protocols'
import { badRequest, ok, unauthorized } from '../../../helpers/http/http'

export class LoginController implements Controller {
  constructor (private readonly authentication: Authentication, private readonly validationComposite: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validationComposite.validate(httpRequest.body)
    if (error) return badRequest(error)
    const { username, password } = httpRequest.body
    const accessToken = await this.authentication.auth({ username, password })
    if (!accessToken) return unauthorized()
    return ok({ accessToken })
  }
}
