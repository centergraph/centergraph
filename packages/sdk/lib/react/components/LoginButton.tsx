import { useAuth } from 'react-oidc-context'

export default function LoginButton() {
  const auth = useAuth()
  return <button onClick={() => auth.signinRedirect()}>Login</button>
}
