import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router'

export function Container({ children }: { children: ReactNode }) {
  return <div className="page-container">{children}</div>
}

export function Section({ children, ...props }: ComponentProps<'section'>) {
  return (
    <section {...props} className={`section-space ${props.className ?? ''}`}>
      {children}
    </section>
  )
}

export function Card({ children }: { children: ReactNode }) {
  return <div className="card-surface">{children}</div>
}

export function SectionHeading({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{label}</p>
      <h2>{children}</h2>
    </div>
  )
}

export function PageHeader({
  label,
  children,
  description,
}: {
  label: string
  children: ReactNode
  description: string
}) {
  return (
    <header className="page-heading">
      <p className="eyebrow">{label}</p>
      <h1>{children}</h1>
      <p className="lead">{description}</p>
    </header>
  )
}

export function Button({ className = '', ...props }: ComponentProps<'button'>) {
  return <button type="button" {...props} className={`button ${className}`} />
}

export function ButtonLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} className={`button ${props.className ?? ''}`} />
}
