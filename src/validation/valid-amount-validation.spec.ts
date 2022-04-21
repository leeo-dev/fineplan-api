import { ValidAmountValidation } from './valid-amount-validation'
import { InvalidParamError } from '../presentation/errors'
import { expect, test, describe } from '@jest/globals'

describe('Valid Amount Validator', () => {
  test('should returns LengthParamError if validation fails', () => {
    const sut = new ValidAmountValidation('amount')
    const error = sut.validate({ amount: 'invalid_param' })
    expect(error).toEqual(new InvalidParamError('amount'))
  })
})
