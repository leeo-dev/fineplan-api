import { MissingParamError } from './../../../errors/missing-param-error'
import { badRequest, notFound, serverError, ok } from './../../../helpers/http/http'
import { Validation, UpdateTransaction, Controller, HttpRequest, HttpResponse } from './update-transaction-controller-protocols'
export class UpdateTransactionController implements Controller {
  constructor (
    private readonly updateTransaction: UpdateTransaction,
    private readonly validationComposite: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validationComposite.validate(httpRequest.body)
      if (error) return badRequest(error)
      const user = httpRequest.user
      if (!user) return badRequest(new MissingParamError('user_id'))
      const { title, type, amount, date } = httpRequest.body
      const { id } = httpRequest.params
      const transaction = await this.updateTransaction.update({ id, title, type, amount, date, user_id: String(user.id) })
      if (!transaction) return notFound(new MissingParamError('id'))
      return ok(transaction)
    } catch (error: any) {
      console.log(error)
      return serverError(error)
    }
  }
}
