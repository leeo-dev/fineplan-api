import { ok, noContent, serverError, forbidden } from './../../../helpers/http/http'
import { AccessDeniedError } from './../../../errors/access-denied-error'
import { LoadTransactions } from './../../../../domain/usecases/transaction/load-transactions'
import { Controller, HttpRequest, HttpResponse } from '../deposit/deposit-controller-protocols'

export class LoadTransactionsController implements Controller {
  constructor (private readonly loadTransactions: LoadTransactions) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const user = httpRequest.user
      if (!user) return forbidden(new AccessDeniedError())
      const userId = user.id

      const transactions = await this.loadTransactions.loadAll(String(userId))
      return transactions.length ? ok(transactions) : noContent()
    } catch (error: any) {
      return serverError(error)
    }
  }
}
