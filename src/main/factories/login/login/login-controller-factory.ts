import { ValidationComposite } from './../../../../validation/validation-composite'
import { JwtAdapter } from '../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AddAccountMongoRepository } from '../../../../infra/db/account/account-mongo-repository'
import { DbAuthentication } from '../../../../data/usecases/account/authentication/db-authentication'
import { LoginController } from '../../../../presentation/controllers/login/login/login-controller'
import env from '../../../config/env'
export const makeLoginController = (): LoginController => {
  const salt = 12
  const jwtAdapter = new JwtAdapter(env.JWT_SECRET)
  const bcryptAdapter = new BcryptAdapter(salt)
  const LoadUserByUsernameRepository = new AddAccountMongoRepository()
  const authentication = new DbAuthentication(LoadUserByUsernameRepository, bcryptAdapter, jwtAdapter)
  const validation = new ValidationComposite([])
  return new LoginController(authentication, validation)
}
