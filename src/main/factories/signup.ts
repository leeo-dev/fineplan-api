import { AddAccountMongoRepository } from '../../infra/db/account-mongo-repository'
import { DbAddAccount } from '../../data/usecases/account/add-account/db-add-account'
import { SignUpController } from '../../presentation/controllers/login/signup/signup'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const mongoAccount = new AddAccountMongoRepository()
  const hasher = new BcryptAdapter(salt)
  const dbAddAccount = new DbAddAccount(mongoAccount, hasher, mongoAccount)
  return new SignUpController(dbAddAccount)
}
