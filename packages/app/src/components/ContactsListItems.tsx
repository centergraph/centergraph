import { Person } from '../types'
import { api } from '../centerGraph'
import View from '@centergraph/sdk/lib/react/components/View'
import { Link, useParams } from 'react-router-dom'
import { Icon } from '@iconify/react'
const { rdf, schema } = api.namespaces

export default function ContactsListItems({ search, offset }: { search: string; offset: number }) {
  const resource = api.query.filter(rdf('type'), schema('Person')).sort(schema('familyName')).paginate(10, offset)
  if (search) resource.fullTextSearch(search)
  const contents = resource.asResource()
  const { slug } = useParams()

  return (
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
  )
}
