const express = require('express')
const { createAuthClient } = require('../auth')
const session = require('express-session')

const auth = createAuthClient({
    domain: 'dev-k2t4k3888k1ic1rm.us.auth0.com',
    client_id: 'MCdb9MAA5o1dspkn6DVNm5uxOuqVnUOr',
    redirect_uri: 'http://localhost:3000/api/callback',
    scope: 'openid profile email',
    client_secret: 'S52S1Ls7HLZDXaGkLk5AMz3bPYYAWbv60zWhrPuybjiNa8zwF9UxQggrN7bEoZyG'
})

const app = new express()
app.use(session({
    secret: 'xhjrs0',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 600000
    }
}))

app.get('/', (req, res) => {
    const user = req.session.user
    if (user) {
        const template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <img src="${user.picture}" alt="">
    <h1>${user.name}</h1>
    <h2>Email: ${user.email}</h2>
</body>
</html>
        `
        return res.send(template)
    }
    return res.send('hello')
})

app.get('/login', (req, res) => {
    res.redirect(auth.startAuthFlow())
})

app.get('/api/callback', async (req, res) => {
    const { code } = req.query
    try {
        const access_token = await auth.handleCallback(code)
        const user = await auth.getUserInfo(access_token)
        const {name, email, picture} = user
        req.session.user = {
            name,
            email,
            picture
        }
        req.session.isAuthenticated = true

        res.redirect(`/`)
    } catch (error) {
        console.log(error)
        return res.status(404).send(error)
    }
})

app.listen(3000, () => {
    console.log('Server running on port 3000')
})