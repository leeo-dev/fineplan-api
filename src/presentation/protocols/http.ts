export type user = {
  id?: string
}
export interface HttpRequest {
  body?: any
  headers?: any
  user?: user
}
export interface HttpResponse {
  statusCode: number
  body: any
}
