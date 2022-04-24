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
    this.validationComposite.validate(httpRequest.body)
    return {
      statusCode: 200,
      body: null
    }
  }
}
