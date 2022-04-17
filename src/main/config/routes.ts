import { Express, Router } from 'express'
export default async (app: Express): Promise<void> => {
  const router = Router()
  app.use('/api', router)
  const signUpRouter = await import('../routes/signup-routes')
  const loginRouter = await import('../routes/login-routes')
  const depositRouter = await import('../routes/transaction-routes')
  signUpRouter.default(router)
  loginRouter.default(router)
  depositRouter.default(router)
}
