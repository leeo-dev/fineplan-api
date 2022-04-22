import { Controller, HttpRequest, HttpResponse, DeleteTransaction } from './delete-transaction-controller-protocols'
import { AccessDeniedError } from './../../../errors/access-denied-error'
import { forbidden } from './../../../helpers/http/http'
export class DeleteTransactionController implements Controller {
  constructor (private readonly deleteTransaction: DeleteTransaction) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { user } = httpRequest
    if (!user) return forbidden(new AccessDeniedError())
    const userId = String(user?.id)
    await this.deleteTransaction.delete(userId)
    return { statusCode: 200, body: null }
  }
}
