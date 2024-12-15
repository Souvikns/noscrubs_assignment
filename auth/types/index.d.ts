export interface Config {
    domain: string;
    client_id: string;
    redirect_uri: string;
    scope: string;
    client_secret: string;
}
export interface ProviderInterface {
    startAuthFlow(): string;
    handleCallback(code: string): Promise<string>;
    refreshToken(refresh_token: string): Promise<string>;
    getUserInfo(access_token: string): Promise<any>;
}
export declare class Provider implements ProviderInterface {
    private config;
    constructor(config: Config);
    startAuthFlow(): string;
    handleCallback(code: string): Promise<string>;
    refreshToken(refresh_token: string): Promise<string>;
    getUserInfo(access_token: string): Promise<any>;
}
export declare class Auth extends Provider {
}
export declare function createAuthClient(config: Config): Auth;
