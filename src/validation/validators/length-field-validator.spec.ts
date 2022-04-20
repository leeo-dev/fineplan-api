import { LengthFieldValidator } from './length-field-validator'
import { LengthParamError } from './../../presentation/errors'
import { expect, test, describe } from '@jest/globals'

describe('Length Field Validator', () => {
  test('should returns LengthParamError if validation fails', () => {
    const sut = new LengthFieldValidator('name')
    const error = sut.validate({ name: 'na' })
    expect(error).toEqual(new LengthParamError('name'))
  })
  test('should returns null if validation succeeds', () => {
    const sut = new LengthFieldValidator('name')
    const error = sut.validate({ name: 'any_name' })
    expect(error).toBeNull()
  })
})
