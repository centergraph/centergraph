import { rdf, schema } from '@centergraph/shared/namespaces'
import { api } from './centerGraph'
import { Person } from './types'
import { useAuth } from 'react-oidc-context'

const johnDoe = await api.load<Person>('/contacts/john-doe').asObject()
console.log(johnDoe)

export default function App() {
  const contactUrls = api.useDocumentUrls((query) => query.filter(rdf('type'), schema('Person')))

  const auth = useAuth()

  switch (auth.activeNavigator) {
    case 'signinSilent':
      return <div>Signing you in...</div>
    case 'signoutRedirect':
      return <div>Signing you out...</div>
  }

  if (auth.isLoading) {
    return <div>Loading...</div>
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>
  }

  if (auth.isAuthenticated) {
    console.log(auth.user)

    return (
      <div>
        Hello {auth.user?.profile.sub} <button onClick={() => void auth.removeUser()}>Log out</button>
      </div>
    )
  }

  return (
    <>
      <h1>Hello</h1>
      <button onClick={() => void auth.signinRedirect()}>Log in</button>
      {contactUrls.map((contactUrl) => api.load<Person>(contactUrl).displayAs('card'))}
    </>
  )
}
