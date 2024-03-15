import { useAuth } from 'react-oidc-context'

export default function LoginButton() {
  const auth = useAuth()
  return auth.isAuthenticated ? (
    <button className="btn btn-primary" onClick={() => auth.removeUser()}>
      Logout
    </button>
  ) : (
    <button className="btn btn-primary" onClick={() => auth.signinRedirect()}>
      Login
    </button>
  )
}
