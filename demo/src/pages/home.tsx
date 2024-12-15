import { Link } from 'react-router-dom'
import auth from '../auth'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

function Home() {
    const url = auth.startAuthFlow()
    const [user, setUser] = useState<any>(undefined)
    const access_token = Cookies.get('access_token')
    console.log(access_token)

    useEffect(() => {
        const fetchUserDetails = async () => {

            if (access_token) {
                const user = await auth.getUserInfo(access_token)
                setUser(user)
            }
        }
        fetchUserDetails()
    }, [])
    if (user) {
        if (user) {

            return <div>
                {<>
                    <h1>{user.name}</h1>
                    <h2>{user.email}</h2>
                    <button onClick={() => {
                        Cookies.remove('access_token')
                        setUser(undefined)
                    }}>Logout</button>
                </>}
            </div>
        }
    }
    return <div>
        <h1>Hello World</h1>
        <button>
            <Link to={url}>Login</Link>
        </button>
    </div>
}

export default Home