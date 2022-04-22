import { Controller, HttpRequest, HttpResponse, DeleteTransaction } from './delete-transaction-controller-protocols'
import { MissingParamError } from './../../../errors'
import { badRequest, noContent, serverError } from './../../../helpers/http/http'
export class DeleteTransactionController implements Controller {
  constructor (private readonly deleteTransaction: DeleteTransaction) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params } = httpRequest
      if (!params.id) badRequest(new MissingParamError('id'))
      await this.deleteTransaction.delete(params.id)
      return noContent()
    } catch (error: any) {
      return serverError(error)
    }
  }
}
