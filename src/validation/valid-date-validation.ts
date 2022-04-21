import { Validation } from './../presentation/protocols/validation'
import { InvalidParamError } from '../presentation/errors'
export class ValidDateValidation implements Validation {
  constructor (private readonly fieldName: string) {}
  validate (input: any): Error | null {
    const isInvalidDate = String(new Date(input[this.fieldName]))
    if (isInvalidDate === 'Invalid Date') return new InvalidParamError(this.fieldName)
    return null
  }
}
