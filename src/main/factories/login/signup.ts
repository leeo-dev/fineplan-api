import { AddAccountMongoRepository } from '../../../infra/db/account/account-mongo-repository'
import { DbAddAccount } from '../../../data/usecases/account/add-account/db-add-account'
import { SignUpController } from '../../../presentation/controllers/login/signup/signup'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter'
import env from '../../config/env'
export const makeSignUpController = (): SignUpController => {
  const jwtAdapter = new JwtAdapter(env.JWT_SECRET)

  const salt = 12
  const mongoAccount = new AddAccountMongoRepository()
  const hasher = new BcryptAdapter(salt)
  const dbAddAccount = new DbAddAccount(mongoAccount, hasher, mongoAccount, jwtAdapter)
  return new SignUpController(dbAddAccount)
}
