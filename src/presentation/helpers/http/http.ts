import { ServerError } from './../../errors/server-error'
import { UnauthorizedError } from '../../../presentation/errors/unauthorized-error'
import { HttpResponse } from '../../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})
export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
})
export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(String(error.stack))
})
export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null
})

export const notFound = (error: Error): HttpResponse => ({
  statusCode: 404,
  body: error
})
