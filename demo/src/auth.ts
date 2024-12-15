import { createAuthClient } from '../../auth/src'

const auth = createAuthClient({
    domain: 'dev-k2t4k3888k1ic1rm.us.auth0.com',
    client_id: 'MCdb9MAA5o1dspkn6DVNm5uxOuqVnUOr',
    redirect_uri: 'http://localhost:3000/api/callback',
    scope: 'openid profile email',
    client_secret: 'S52S1Ls7HLZDXaGkLk5AMz3bPYYAWbv60zWhrPuybjiNa8zwF9UxQggrN7bEoZyG'
})

export default auth