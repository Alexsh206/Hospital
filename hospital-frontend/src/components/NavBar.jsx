import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'

export default function NavBar() {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
    return (
        <nav>
            <Link to="/">Home</Link>
            {isAuthenticated && (
                <>
                    <Link to="/patients">Patients</Link>
                    <Link to="/doctors">Doctors</Link>
                    <button onClick={() => logout({ returnTo: window.location.origin })}>
                        Logout
                    </button>
                </>
            )}
            {!isAuthenticated && <button onClick={() => loginWithRedirect()}>Login</button>}
        </nav>
    )
}