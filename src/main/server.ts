import { MongoHelper } from '../infra/helpers/mongo-helper'
import env from './config/env'
MongoHelper.connect(env.mongoURL).then(async () => {
  const app = (await import('./config/app')).default
  app.listen(env.PORT, () => console.log(`Server running at: http://localhost:${env.PORT}`))
}).catch(console.error)
