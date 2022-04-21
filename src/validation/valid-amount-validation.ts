import { Validation } from './../presentation/protocols/validation'
import { InvalidParamError } from '../presentation/errors'
export class ValidAmountValidation implements Validation {
  constructor (private readonly fieldName: string) {}
  validate (input: any): Error | null {
    const isInvalidAmount = isNaN(input[this.fieldName])
    if (isInvalidAmount || input[this.fieldName] <= 0) return new InvalidParamError(this.fieldName)
    return null
  }
}
