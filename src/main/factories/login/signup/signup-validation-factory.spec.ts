import { makeSignUpValidation } from './signup-validation-factory'
import { LengthFieldValidator } from './../../../../validation/length-field-validator'
import { RequiredFieldsValidator } from './../../../../validation/required-fields-validator'
import { Validation } from './../../../../presentation/protocols/validation'
import { ValidationComposite } from './../../../../validation/validation-composite'
import { expect, test, describe, jest } from '@jest/globals'

jest.mock('../../../../validation/validation-composite')

describe('LoginValidation Factory', () => {
  test('should call Validation Composite with all validations', () => {
    const validations: Validation[] = []
    const requiredFields = ['username', 'password']
    for (const field of requiredFields) {
      validations.push(new RequiredFieldsValidator(field))
      validations.push(new LengthFieldValidator(field, 3, 25))
    }
    makeSignUpValidation()
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
  })
})
