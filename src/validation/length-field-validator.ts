import { LengthParamError } from '../presentation/errors'
import { Validation } from '../presentation/protocols/validation'
export class LengthFieldValidator implements Validation {
  constructor (private readonly fieldName: string,
    private readonly minLength: number = 3,
    private readonly maxLength: number = 25) {}

  validate (input: any): Error | null {
    if (input[this.fieldName]?.length < 3 || input[this.fieldName]?.length > 25) return new LengthParamError(this.fieldName, this.minLength, this.maxLength)
    return null
  }
}
