import { ReactNode } from 'react'

export default function GridRegion({ name, children }: { children: ReactNode; name: string }) {
  return (
    <div style={{ gridArea: name }} className={`grid-region grid-region-${name}`}>
      <span className="name">Region: {name}</span>
      {children}
    </div>
  )
}
