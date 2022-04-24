import { makeUpdateValidation } from './update-validation-factory'
import { ValidationComposite } from '../../../../validation/validation-composite'
import { RequiredFieldsValidator } from '../../../../validation/required-fields-validator'
import { ValidDateValidation } from '../../../../validation/valid-date-validation'
import { Validation } from '../../../../presentation/protocols/validation'
import { expect, test, describe, jest } from '@jest/globals'

jest.mock('./../../../../validation/validation-composite')

describe('Deposit Validation Factory', () => {
  test('should call Validation Composite with all validations', () => {
    const validations: Validation[] = []
    const requiredFields = ['title', 'amount', 'date', 'type']
    validations.push(new ValidDateValidation('date'))
    for (const field of requiredFields) {
      validations.push(new RequiredFieldsValidator(field))
    }
    makeUpdateValidation()
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
