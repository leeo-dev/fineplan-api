export default {
  mongoURL: process.env.MONGO_URL ?? 'mongodb://localhost:27017/finePlanApi',
  PORT: process.env.PORT ?? 3000,
  JWT_SECRET: process.env.JWT_SECRET ?? 'atLL*r_7TR'
}
