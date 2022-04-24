import { makeMiddleware } from './../factories/middlewares/auth-middleware-factory'
import { adaptRoute } from './../adapters/express-route-adapter'
import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-route-adapter'
import { makeDepositController } from '../factories/transaction/deposit/deposit-controller-factory'
import { makeWithdrawController } from '../factories/transaction/withdraw/withdraw-controller-factory'
import { makeLoadTransactionsController } from '../factories/transaction/load-transactions/load-transactions-controller-factory'
import { makeDeleteTransactionController } from '../factories/transaction/delete-transaction/delete-transaction-controller-factory'
import { makeUpdateTransactionControllerFactory } from '../factories/transaction/update-transaction/update-controller-factory'

export default (router: Router): void => {
  const authMiddleware = adaptMiddleware(makeMiddleware())
  router.post('/transactions/deposit', authMiddleware, adaptRoute(makeDepositController()))
  router.post('/transactions/withdraw', authMiddleware, adaptRoute(makeWithdrawController()))
  router.get('/transactions', authMiddleware, adaptRoute(makeLoadTransactionsController()))
  router.delete('/transactions/:id', authMiddleware, adaptRoute(makeDeleteTransactionController()))
  router.put('/transactions/:id', authMiddleware, adaptRoute(makeUpdateTransactionControllerFactory()))
}
