import { makeDepositValidation } from './deposit-validation-factory'
import { ValidationComposite } from '../../../../validation/validation-composite'
import { RequiredFieldsValidator } from '../../../../validation/required-fields-validator'
import { ValidDateValidation } from '../../../../validation/valid-date-validation'
import { ValidAmountValidation } from '../../../../validation/valid-amount-validation'
import { Validation } from '../../../../presentation/protocols/validation'
import { expect, test, describe, jest } from '@jest/globals'

jest.mock('./../../../../validation/validation-composite')

describe('Deposit Validation Factory', () => {
  test('should call Validation Composite with all validations', () => {
    const validations: Validation[] = []
    const requiredFields = ['title', 'amount', 'date']
    validations.push(new ValidAmountValidation('amount'))
    validations.push(new ValidDateValidation('date'))
    for (const field of requiredFields) {
      validations.push(new RequiredFieldsValidator(field))
    }
    makeDepositValidation()
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
