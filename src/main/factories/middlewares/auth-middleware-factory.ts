import { DbLoadAccountByAccessToken } from '../../../data/usecases/account/load-account-by-access-token/db-load-account-by-access-token'
import { Middleware } from './../../../presentation/protocols/middleware'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter'
import { AddAccountMongoRepository } from '../../../infra/db/account/account-mongo-repository'
import env from '../../config/env'
import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware'
export const makeMiddleware = (): Middleware => {
  const jwtAdapter = new JwtAdapter(env.JWT_SECRET)
  const LoadAccountByIdRepository = new AddAccountMongoRepository()
  const dbLoadAccountByAccessToken = new DbLoadAccountByAccessToken(jwtAdapter, LoadAccountByIdRepository)
  return new AuthMiddleware(dbLoadAccountByAccessToken)
}
