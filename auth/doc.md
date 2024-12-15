# Auth 2.0 

`Auth` is a library that makes your Auth 2.0 flow easy. It generates authentication url and handles callback along side fetching user data.

### Usage 


#### Installation and Setting up
```ts
import { createAuthClient } from 'auth'

const authClient = createAuthClient({
    domain: process.env.DOMAIN,
    client_id: process.env.CLIENT_ID,
    redirect_uri: 'http://localhost:3000/api/callback',
    scope: 'openid profile email',
    client_secret: process.env.CLIENT_SECRET
})
```

#### Function Supported by `Auth`


```ts

// async startAuthFlow(): string 
const url = authClient.startAuthFlow()

// async handleCallback(code: string): Promise<string>
const access_token = await authClient.handleCallback(code)

// async getUserInfo(access_token: string): Promise<any>
const user = await authClient.getUserInfo(access_token)

// async refreshToken(refresh_token): Promise<string>
const access_token = await authClient.refreshToken(refresh_token)

```

### Extend OAuth library to add new functions or update existing functions.

`Auth` library is built in a way that it is very easy to extend and modify. The library exports an `ProviderInterface` which users can use to modify entire library with custom functionalities. The library also exports `Provider` class to extend and add new functions or modify the existing ones.


Lets look at an example to how we can extend the `OAuth` library to add a new function called `logout`.

```ts
import { Provider } from 'auth'

class Auth extends Provider {
    async function logout() {
        // Implement custom logic for logging out
    }
}

const auth = new Auth({
    domain: process.env.DOMAIN,
    client_id: process.env.CLIENT_ID,
    redirect_uri: 'http://localhost:3000/api/callback',
    scope: 'openid profile email',
    client_secret: process.env.CLIENT_SECRET
})

await auth.logout()

```

You can even implement the `ProviderInterface` to change all the functions. 

```ts
import { ProviderInterface } from 'auth'

class Auth implements ProviderInterface {
    // Implment all the functions and add custom logic.
}

const auth = new Auth()

auth.startAuthFlow()

```

