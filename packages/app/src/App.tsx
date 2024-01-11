import { Person } from './types'
import { api, base } from './centerGraph'
import View from '@centergraph/sdk/lib/react/components/View'
import { Link, Outlet, useParams } from 'react-router-dom'
import { Icon } from '@iconify/react'

export default function App() {
  const contents = api.getFolder('/contacts/').asResource()
  const { slug } = useParams()

  return (
    <>
      <div className="container">
        <header>
          <h1>
            <Link to="/">
              <img src={base + '/logo.svg'} style={{ height: 50 }} />
              &nbsp;Address book
            </Link>
          </h1>
        </header>
        <main className="row">
          <aside className="col-3">
            <em>{contents.length ?? '...'} contacts</em>

            <ul className="list-group">
              {contents.map((contactUrl) => {
                const contactSlug = contactUrl.value.split('/').pop()

                return (
                  <li
                    key={contactUrl.value}
                    className={`d-flex list-group-item ${contactSlug === slug ? 'active' : ''}`}
                  >
                    <Link className={contactSlug === slug ? 'text-bg-dark' : ''} to={`/contact/${contactSlug}`}>
                      <View data={api.get<Person>(contactUrl)} as="card" />
                    </Link>
                    <Link className="btn ms-auto btn-secondary btn-sm" to={`/contact/${contactSlug}/edit`}>
                      <Icon icon="bx:edit" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </aside>
          <main className="col-9">
            <Outlet />
          </main>
        </main>
      </div>
    </>
  )
}
