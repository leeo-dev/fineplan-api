import { ValidationComposite, RequiredFieldsValidator, ValidAmountValidation, ValidDateValidation } from './../../../../validation'
import { Validation } from './../../../../presentation/protocols/validation'
export const makeWithdrawValidation = (): Validation => {
  const validations: Validation[] = []
  const requiredFields = ['title', 'amount', 'date']
  validations.push(new ValidAmountValidation('amount'))
  validations.push(new ValidDateValidation('date'))
  for (const field of requiredFields) {
    validations.push(new RequiredFieldsValidator(field))
  }

  return new ValidationComposite(validations)
}
