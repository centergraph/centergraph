import { base } from '../centerGraph'
import { Link } from 'react-router-dom'
import LoginButton from '@centergraph/sdk/lib/react/components/LoginButton'

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary mb-5">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img src={base + '/logo.svg'} style={{ height: 32 }} />
          &nbsp;&nbsp;Address book
        </Link>

        <LoginButton />
      </div>
    </nav>
  )
}
