import { MissingParamError } from './../../../errors/missing-param-error'
import { badRequest, notFound } from './../../../helpers/http/http'
import { Validation } from './../../../protocols/validation'
import { UpdateTransaction } from './../../../../domain/usecases/transaction/update-transaction'
import { HttpRequest, HttpResponse } from '../deposit/deposit-controller-protocols'
import { Controller } from './../../../protocols/controller'
export class UpdateTransactionController implements Controller {
  constructor (
    private readonly updateTransaction: UpdateTransaction,
    private readonly validationComposite: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validationComposite.validate(httpRequest.body)
    if (error) return badRequest(error)
    const { title, type, amount, date } = httpRequest.body
    const { id } = httpRequest.params
    const user = httpRequest.user
    if (!user) return badRequest(new MissingParamError('user_id'))
    const userId = String(user.id)
    const transaction = await this.updateTransaction.update({ id, title, type, amount, date, user_id: userId })
    if (!transaction) return notFound(new MissingParamError('id'))
    return {
      statusCode: 200,
      body: null
    }
  }
}
