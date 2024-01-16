import { Person } from '../types'
import { api } from '../centerGraph'
import View from '@centergraph/sdk/lib/react/components/View'
import { Link, useParams } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { Suspense } from 'react'
const { rdf, schema } = api.namespaces

export default function ContactsListItems({ search }: { search: string }) {
  const resource = api.query.filter(rdf('type'), schema('Person')).sort(schema('name'))
  if (search) resource.fullTextSearch(search)
  const contents = resource.asResource()
  const { slug } = useParams()

  return (
    <ul className="list-group">
      <Suspense>
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
      </Suspense>
    </ul>
  )
}
