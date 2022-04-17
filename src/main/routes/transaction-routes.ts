import { adaptRoute } from './../adapters/express-route-adapter'
import { Router } from 'express'
import { makeDepositController } from '../factories/transaction/deposit'

export default (router: Router): void => {
  router.post('/transaction/deposit', adaptRoute(makeDepositController()))
}
