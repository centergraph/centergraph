import { api } from './centerGraph'

function App() {
  const Card = api.get('/contacts/john-doe').as('card')

  return (
    <>
      <div>
        <h1>Hello</h1>
        {Card ? <Card /> : null}
      </div>
    </>
  )
}

export default App
