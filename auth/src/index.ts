export interface Config {
    domain: string,
    client_id: string,
    redirect_uri: string,
    scope: string,
    client_secret: string
}

export interface ProviderInterface {
    startAuthFlow(): string
    handleCallback(code: string): Promise<string>
    refreshToken(refresh_token: string): Promise<string>
    getUserInfo(access_token: string): Promise<any>
}

export class Provider implements ProviderInterface {
    constructor(
        private config: Config
    ) { }

    startAuthFlow(): string {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.config.client_id,
            redirect_uri: this.config.redirect_uri,
            scope: this.config.scope
        }).toString()
        return `https://${this.config.domain}/authorize?${params}`
    }
    async handleCallback(code: string): Promise<string> {
        const tokenEndPoint = `https://${this.config.domain}/oauth/token`
        const payload = {
            grant_type: 'authorization_code',
            client_id: this.config.client_id,
            client_secret: this.config.client_secret,
            code,
            redirect_uri: this.config.redirect_uri,
            scope: this.config.scope
        }
        try {
            const res = await fetch(tokenEndPoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            console.log(data)
            const { access_token, id_token, refresh_token } = data
            return access_token
        } catch (error) {
            throw error
        }
    }
    async refreshToken(refresh_token: string): Promise<string> {
        const tokenEndpoint = `https://${this.config.domain}/oauth/token`
        const payload = {
            grant_type: 'refresh_token',
            client_id: this.config.client_id,
            refresh_token
        }
        try {
            const res = await fetch(tokenEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json()
            return data
        } catch (error) {
            throw error
        }
    }

    async getUserInfo(access_token: string): Promise<any> {
        const userInfoEndpoint = `https://${this.config.domain}/userinfo`
        try {
            const res = await fetch(userInfoEndpoint, {
                method: 'Get',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json()
            return data
        } catch (error) {
            throw error
        }
    }
}

export function createAuthClient(config: Config) {
    return new Provider(config)
}

