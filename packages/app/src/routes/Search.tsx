import List from '@centergraph/sdk/lib/react/components/List'
import { Person } from '../types'
import { api } from '../centerGraph'
import { useEffect, useState } from 'react'

const { schema, rdf } = api.namespaces

const baseQuery = api.query.filter(rdf('type'), schema('Person'))

export default function Search() {
  const [query, setQuery] = useState(baseQuery)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const query = baseQuery.clone()
    if (search) query.fullTextSearch(search)
    setQuery(query)
  }, [search])

  return (
    <>
      <h1>Search</h1>

      <input type="search" onChange={(event) => setSearch(event.target.value)} value={search} />

      <List<Person> query={query} as="card" />
    </>
  )
}
