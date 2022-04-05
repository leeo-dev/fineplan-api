import { Express, Router } from 'express'
export default async (app: Express): Promise<void> => {
  const router = Router()
  app.use('/api', router)
  const signUpRouter = await import('@/main/routes/signup-routes')
  signUpRouter.default(router)
}
