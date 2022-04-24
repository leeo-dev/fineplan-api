import { Controller, HttpRequest, HttpResponse, DeleteTransaction } from './delete-transaction-controller-protocols'
import { MissingParamError } from './../../../errors'
import { badRequest, noContent, serverError, notFound } from './../../../helpers/http/http'
export class DeleteTransactionController implements Controller {
  constructor (private readonly deleteTransaction: DeleteTransaction) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params } = httpRequest
      if (!params.id) return badRequest(new MissingParamError('id'))
      const isDeleted = await this.deleteTransaction.delete(params.id)
      if (!isDeleted) return notFound(new MissingParamError('id'))
      return noContent()
    } catch (error: any) {
      return serverError(error)
    }
  }
}
