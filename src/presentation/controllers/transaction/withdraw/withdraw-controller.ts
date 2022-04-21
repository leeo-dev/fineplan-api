import { Controller, AddTransaction, HttpRequest, HttpResponse, Validation } from './withdraw-controller-protocols'
import { badRequest, noContent } from './../../../helpers/http/http'

export class WithdrawController implements Controller {
  constructor (private readonly addTransaction: AddTransaction,
    private readonly validationComposite: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validationComposite.validate(httpRequest.body)
    if (error) return badRequest(error)

    const { title, amount, date } = httpRequest.body
    const { user } = httpRequest

    this.addTransaction.add({ title, amount: Number(amount * -1), date: new Date(date), type: 'withdraw', user_id: String(user?.id) })
    return noContent()
  }
}
