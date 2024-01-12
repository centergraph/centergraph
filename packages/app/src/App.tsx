import { Person } from './types'
import { api, base } from './centerGraph'
import View from '@centergraph/sdk/lib/react/components/View'
import { Link, Outlet, useParams } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { Suspense, useEffect, useState, useTransition } from 'react'
const { rdf, schema } = api.namespaces
import df from '@rdfjs/data-model'

export default function App() {
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
        if (search) resource.filter(schema('givenName'), df.literal('John'))
        return resource.asResource()
      })
    })
  }, [search])

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary mb-4">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <img src={base + '/logo.svg'} style={{ height: 32 }} />
            &nbsp;&nbsp;Address book
          </Link>
        </div>
      </nav>

      <div className="container">
        <main className="row">
          <aside className="col-3">
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

            <Suspense>
              <em>{contents.length ?? '...'} contacts</em>

              <ul className="list-group">
                {contents.map((contactUrl) => {
                  const contactSlug = contactUrl.value.split('/').pop()

                  return (
                    <Link
                      to={`/contact/${contactSlug}`}
                      key={contactUrl.value}
                      className={`d-flex list-group-item ${contactSlug === slug ? 'active' : ''}`}
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
            </Suspense>
          </aside>
          <main className="col-9">
            <Outlet />
          </main>
        </main>
      </div>
    </>
  )
}
