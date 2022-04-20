import { MissingParamError } from './../../presentation/errors/missing-param-error'
import { expect, test, describe } from '@jest/globals'
import { RequiredFieldsValidator } from './required-fields-validator'

describe('Required Fields Validator', () => {
  test('should returns MissingParamError if validation fails', () => {
    const sut = new RequiredFieldsValidator('name')
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError('name'))
  })
  test('should returns null if validation succeeds', () => {
    const sut = new RequiredFieldsValidator('name')
    const error = sut.validate({ name: 'any_name' })
    expect(error).toBeNull()
  })
})
