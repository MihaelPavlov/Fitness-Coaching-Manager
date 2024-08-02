export const invalidAccessTokens: Array<string> = [];

export const invalidateAccessToken = (token: string) => invalidAccessTokens.push(token);