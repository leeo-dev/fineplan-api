import { ValidDateValidation } from './valid-date-validation'
import { InvalidParamError } from '../presentation/errors'
import { expect, test, describe } from '@jest/globals'

describe('Valid Amount Validator', () => {
  test('should returns LengthParamError if validation fails', () => {
    const sut = new ValidDateValidation('date')
    const error = sut.validate({ date: 'invalid_date' })
    expect(error).toEqual(new InvalidParamError('date'))
  })
  test('should returns null if validation succeeds', () => {
    const sut = new ValidDateValidation('date')
    const error = sut.validate({ date: '2020-05-05' })
    expect(error).toBeNull()
  })
})
