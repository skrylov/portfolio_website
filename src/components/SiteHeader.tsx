import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { Container } from './Primitives'

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Container>
        <div className="header-row">
          <Link className="wordmark" to="/" aria-label="Sergey Krylov — home">
            Sergey Krylov<span>Product management</span>
          </Link>
          <nav aria-label="Main navigation">
            <Link to="/">Home</Link>
            <Link to={{ pathname: '/', hash: '#selected-work' }}>
              Selected Work
            </Link>
            <Link to={{ pathname: '/', hash: '#contact' }}>Contact</Link>
            <a href="https://drive.google.com/file/d/1NwEAJ8qCJFFT4MmrZqpQ6yYTH_bhZPYE/view?usp=drive_link">
              My CV <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </nav>
        </div>
      </Container>
    </header>
  )
}
