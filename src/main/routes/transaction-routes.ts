import { adaptRoute } from './../adapters/express-route-adapter'
import { Router } from 'express'
import { makeDepositController } from '../factories/transaction/deposit'
import { makeWithdrawController } from '../factories/transaction/withdraw'

export default (router: Router): void => {
  router.post('/transaction/deposit', adaptRoute(makeDepositController()))
  router.post('/transaction/withdraw', adaptRoute(makeWithdrawController()))
}
