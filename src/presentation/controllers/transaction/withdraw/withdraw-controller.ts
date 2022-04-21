import { Controller, AddTransaction, HttpRequest, HttpResponse, Validation } from './withdraw-controller-protocols'
import { MissingParamError } from './../../../errors/missing-param-error'
import { badRequest, forbidden, noContent } from './../../../helpers/http/http'

export class WithdrawController implements Controller {
  constructor (private readonly addTransaction: AddTransaction,
    private readonly validationComposite: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validationComposite.validate(httpRequest.body)
    if (error) return badRequest(error)

    const { title, amount, date } = httpRequest.body
    const { user } = httpRequest
    if (!user) return forbidden(new MissingParamError('id'))
    const userId = user.id
    this.addTransaction.add({ title, amount: Number(amount * -1), date: new Date(date), type: 'withdraw', user_id: String(userId) })
    return noContent()
  }
}
