import { Person } from '../types'
import { api } from '../centerGraph'
import View from '@centergraph/sdk/lib/react/components/View'
import { Link, useParams } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { useEffect, useState, useTransition } from 'react'
const { rdf, schema } = api.namespaces

export default function ContactsList() {
  const [, startTransition] = useTransition()
  const [contents, setContents] = useState(() =>
    api.query.filter(rdf('type'), schema('Person')).sort(schema('name')).asResource()
  )
  const [search, setSearch] = useState('')
  const { slug } = useParams()

  useEffect(() => {
    startTransition(() => {
      setContents(() => {
        const resource = api.query.filter(rdf('type'), schema('Person')).sort(schema('name'))
        if (search) resource.fullTextSearch(search)
        return resource.asResource()
      })
    })
  }, [search])

  return (
    <div className="p-4 bg-light rounded-3  me-5">
      <em className="pb-2 d-block">Search</em>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <span className="input-group-text">
          <Icon icon="line-md:search" />
        </span>
      </div>

      <em className="pb-2 d-block">
        {contents.length ?? '...'} {search ? 'matches' : 'contacts'}
      </em>

      <ul className="list-group">
        {contents.map((contactUrl) => {
          const contactSlug = contactUrl.value.split('/').pop()

          return (
            <Link
              to={`/contact/${contactSlug}`}
              key={contactUrl.value}
              className={`d-flex align-items-center list-group-item ${contactSlug === slug ? 'active' : ''}`}
            >
              <View data={api.get<Person>(contactUrl)} as="card" />
              <object className="ms-auto">
                <Link className="btn btn-light btn-sm" to={`/contact/${contactSlug}/edit`}>
                  <Icon icon="bx:edit" />
                </Link>
              </object>
            </Link>
          )
        })}
      </ul>
    </div>
  )
}
