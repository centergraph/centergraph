import { api } from '../centerGraph'
import { Person } from '../types'

export default function Home() {
  const person = api.get<Person>('/contacts/derrick-abbott').asResource()

  return (
    <>
      <h1>CenterGraph Demo app.</h1>
      <p>Welcome to this demo app of CenterGraph</p>
    </>
  )
}
