import { makeMiddleware } from './../factories/middlewares/auth-middleware-factory'
import { adaptRoute } from './../adapters/express-route-adapter'
import { Router } from 'express'
import { makeDepositController } from '../factories/transaction/deposit'
import { makeWithdrawController } from '../factories/transaction/withdraw'
import { adaptMiddleware } from '../adapters/express-middleware-route-adapter'

export default (router: Router): void => {
  const authMiddleware = adaptMiddleware(makeMiddleware())
  router.post('/transaction/deposit', authMiddleware, adaptRoute(makeDepositController()))
  router.post('/transaction/withdraw', adaptRoute(makeWithdrawController()))
}
