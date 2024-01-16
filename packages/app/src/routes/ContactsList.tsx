import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { Suspense, useState } from 'react'
import ContactsListItems from '../components/ContactsListItems'

export default function ContactsList() {
  const [search, setSearch] = useState('')

  return (
    <div className="p-4 bg-light rounded-3  me-5">
      <em className="pb-2 d-block">Search</em>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
          }}
        />
        <span className="input-group-text">
          <Icon icon="line-md:search" />
        </span>
      </div>

      <div>
        <em className="pb-2 d-flex mb-2">
          <Link to="/contact/add" className="btn btn-outline-secondary btn-sm ms-auto">
            + contact
          </Link>
        </em>
      </div>
      <Suspense>
        <ContactsListItems search={search} />
      </Suspense>
    </div>
  )
}
