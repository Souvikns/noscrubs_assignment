import { useSearchParams, useNavigate } from 'react-router-dom'
import auth from '../auth'
import { useEffect, useState } from 'react'
import cookies from 'js-cookie'


function Callback() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const code = searchParams.get('code')
    const [token, setToken] = useState<string | undefined>(undefined)

    useEffect(() => {
        const getUser = async () => {
            try {
                const access_token = await auth.handleCallback(code || '')
                setToken(access_token)
            } catch (error) {

            }
        }
        getUser()
    }, [])

    if (token) {
        cookies.set('access_token', token, {secure: true})
        navigate('/', { replace: true })
    }

    return <div>
    </div>
}

export default Callback