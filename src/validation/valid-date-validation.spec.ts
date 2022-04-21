import { ValidDateValidation } from './valid-date-validation'
import { InvalidParamError } from '../presentation/errors'
import { expect, test, describe } from '@jest/globals'

describe('Valid Amount Validator', () => {
  test('should returns LengthParamError if validation fails', () => {
    const sut = new ValidDateValidation('date')
    const error = sut.validate({ amount: 'invalid_date' })
    expect(error).toEqual(new InvalidParamError('date'))
  })
})
