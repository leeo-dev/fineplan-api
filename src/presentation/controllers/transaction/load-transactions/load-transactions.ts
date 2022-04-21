import { ok, noContent, serverError } from './../../../helpers/http/http'
import { LoadTransactions } from './../../../../domain/usecases/transaction/load-transactions'
import { Controller, HttpRequest, HttpResponse } from '../deposit/deposit-controller-protocols'

export class LoadTransactionsController implements Controller {
  constructor (private readonly loadTransactions: LoadTransactions) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const user = httpRequest.user

      const transactions = await this.loadTransactions.loadAll(String(user?.id))
      return transactions.length ? ok(transactions) : noContent()
    } catch (error: any) {
      return serverError(error)
    }
  }
}
