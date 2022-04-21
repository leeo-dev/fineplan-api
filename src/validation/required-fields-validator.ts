import { MissingParamError } from '../presentation/errors/missing-param-error'
import { Validation } from '../presentation/protocols/validation'
export class RequiredFieldsValidator implements Validation {
  constructor (private readonly fieldName: string) {}
  validate (input: any): Error | null {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
    return null
  }
}
