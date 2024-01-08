import { ReactNode } from 'react'

export default function GridRegion({ name, children }: { children?: ReactNode; name: string | undefined }) {
  return (
    <div style={{ gridArea: name ?? 'undefined' }} className={`grid-region grid-region-${name ?? 'undefined'}`}>
      <span className="name">{name !== '_undefined' ? `Region:  ${name}` : 'No region'}</span>
      {children}
    </div>
  )
}
