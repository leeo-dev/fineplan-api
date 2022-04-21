import { LengthFieldValidator } from './../../../../validation/length-field-validator'
import { RequiredFieldsValidator } from './../../../../validation/required-fields-validator'
import { ValidationComposite } from './../../../../validation/validation-composite'
import { Validation } from './../../../../presentation/protocols/validation'
export const makeSignUpValidation = (): Validation => {
  const requiredFields = ['username', 'password']
  const validation: Validation[] = []
  for (const field of requiredFields) {
    validation.push(new RequiredFieldsValidator(field))
    validation.push(new LengthFieldValidator(field, 3, 25))
  }
  return new ValidationComposite(validation)
}
