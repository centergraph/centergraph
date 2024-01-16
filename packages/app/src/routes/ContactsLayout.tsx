import { Outlet } from 'react-router-dom'
import ContactsList from './ContactsList'

export default function ContactsLayout() {
  return (
    <>
      <div className="container">
        <main className="row">
          <aside className="col-4">
            <ContactsList />
          </aside>
          <main className="col-8">
            <Outlet />
          </main>
        </main>
      </div>
    </>
  )
}
