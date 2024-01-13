import { base } from '../centerGraph'
import { Link, Outlet } from 'react-router-dom'
import ContactsList from './ContactsList'

export default function App() {
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
            <ContactsList />
          </aside>
          <main className="col-9">
            <Outlet />
          </main>
        </main>
      </div>
    </>
  )
}
