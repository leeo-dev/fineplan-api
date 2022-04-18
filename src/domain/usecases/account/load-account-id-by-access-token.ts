export interface LoadAccountIdByAccessToken {
  loadById: (accessToken: string) => Promise<string | null>
}
