import { Middleware } from './../../presentation/protocols/middleware'
import { HttpRequest } from '../../presentation/protocols'
import { Request, Response, NextFunction } from 'express'
export const adaptMiddleware = (middleware: Middleware): any => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: request.headers
    }
    const httpResponse = await middleware.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      Object.assign(request, httpResponse.body)
      return next()
    }
    response.status(httpResponse.statusCode).json(httpResponse.body.message)
  }
}
