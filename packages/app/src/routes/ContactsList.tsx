import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { Suspense, useState } from 'react'
import ContactsListItems from '../components/ContactsListItems'
import { useEffect } from '@preact-signals/safe-react/react'

export default function ContactsList() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [search])

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
        <ContactsListItems offset={page * 30} search={search} />

        <div className="buttons pt-2 d-flex gap-2 align-content-space-between">
          <button className="btn btn-secondary" disabled={page < 1} onClick={() => setPage((page) => page - 1)}>
            <Icon icon="mingcute:left-fill" />
          </button>
          <button className="btn btn-secondary ms-auto" onClick={() => setPage((page) => page + 1)}>
            <Icon icon="mingcute:right-fill" />
          </button>
        </div>
      </Suspense>
    </div>
  )
}
