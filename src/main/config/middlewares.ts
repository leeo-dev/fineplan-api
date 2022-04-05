import { Express } from 'express'
import { bodyParser } from '@/main/middleware/body-parser'
import { cors } from '@/main/middleware/cors'
export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
}
