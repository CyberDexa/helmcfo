declare module "intuit-oauth" {
  interface OAuthClientOptions {
    clientId: string;
    clientSecret: string;
    environment: "sandbox" | "production";
    redirectUri: string;
  }

  interface AuthorizeUriOptions {
    scope: string[];
    state?: string;
  }

  interface TokenResponse {
    getJson(): {
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
      x_refresh_token_expires_in: number;
      realmId?: string;
    };
  }

  interface TokenData {
    token_type: string;
    access_token: string;
    refresh_token: string;
    x_refresh_token_expires_in: number;
    expires_in: number;
    createdAt: number;
  }

  class OAuthClient {
    static scopes: { Accounting: string; Payment: string; Payroll: string };
    constructor(options: OAuthClientOptions);
    authorizeUri(options: AuthorizeUriOptions): string;
    createToken(url: string): Promise<TokenResponse>;
    setToken(token: TokenData): void;
    refreshUsingToken(refreshToken: string): Promise<TokenResponse>;
  }

  export = OAuthClient;
}
