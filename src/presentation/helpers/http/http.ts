export const badRequest = (error: Error): any => ({
  statusCode: 400,
  body: error
})
