import { UnauthorizedError } from '../../../presentation/errors/unauthorized-error'
import { ServerError } from '../../errors/server-error'
import { HttpResponse } from '../../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})
export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
})
export const serverError = (): HttpResponse => ({
  statusCode: 403,
  body: new ServerError()
})
export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
