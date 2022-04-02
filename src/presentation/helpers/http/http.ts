export const badRequest = (error: Error): any => ({
  statusCode: 400,
  body: error
})
export const forbidden = (error: Error): any => ({
  statusCode: 403,
  body: error
})
