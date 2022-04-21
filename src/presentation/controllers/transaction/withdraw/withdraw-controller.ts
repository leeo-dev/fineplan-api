import { Controller, AddTransaction, HttpRequest, HttpResponse, Validation } from './withdraw-controller-protocols'
import { badRequest, noContent } from './../../../helpers/http/http'
import { InvalidParamError, LengthParamError, MissingParamError } from '../../../errors'

export class WithdrawController implements Controller {
  constructor (private readonly addTransaction: AddTransaction,
    private readonly validationComposite: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validationComposite.validate(httpRequest.body)
    const requiredFields = ['title', 'date', 'amount']
    for (const field of requiredFields) {
      const lengthField = httpRequest.body[field]?.length
      if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      if (field === 'amount') break
      if (lengthField < 3 || lengthField > 25) return badRequest(new LengthParamError(field, 3, 25))
    }

    const { title, amount, date } = httpRequest.body
    const { user } = httpRequest

    const isInvalidAmount = isNaN(amount)
    if (isInvalidAmount || amount <= 0) return badRequest(new InvalidParamError('amount'))
    const isInvalidDate = String(new Date(date))
    if (isInvalidDate === 'Invalid Date') return badRequest(new InvalidParamError('date'))
    this.addTransaction.add({ title, amount: Number(amount * -1), date: new Date(date), type: 'withdraw', user_id: String(user?.id) })
    return noContent()
  }
}
