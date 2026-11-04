import { Container } from './Primitives'

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="contact" tabIndex={-1}>
      <Container>
        <div className="footer-row">
          <div>
            <p className="wordmark">Sergey Krylov</p>
            <p className="metadata">
              Product management portfolio · Design preview
            </p>
          </div>
          <nav aria-label="Contact links">
            <a href="mailto:skrylov22@gmail.com">Email me</a>
            <a href="https://www.linkedin.com/in/s-krylov">LinkedIn</a>
            <a href="https://drive.google.com/file/d/1NwEAJ8qCJFFT4MmrZqpQ6yYTH_bhZPYE/view?usp=drive_link">
              My CV
            </a>
          </nav>
        </div>
      </Container>
    </footer>
  )
}
