import { ValidationComposite, RequiredFieldsValidator, ValidDateValidation } from './../../../../validation'
import { Validation } from './../../../../presentation/protocols/validation'
export const makeUpdateValidation = (): Validation => {
  const validations: Validation[] = []
  const requiredFields = ['title', 'amount', 'date', 'type']
  validations.push(new ValidDateValidation('date'))
  for (const field of requiredFields) {
    validations.push(new RequiredFieldsValidator(field))
  }

  return new ValidationComposite(validations)
}
