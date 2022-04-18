export interface LoadAccountIdByAccessToken {
  loadIdByAccessToken: (accessToken: string) => Promise<string | null>
}
