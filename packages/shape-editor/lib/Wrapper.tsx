import { ReactNode } from 'react'
import { useDrop } from 'react-dnd'

export default function Wrapper({ children, wrapper }: { children?: ReactNode; wrapper: string }) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'CARD',
      drop: (...args) => console.log('wrapper-' + wrapper, args),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [wrapper]
  )

  return (
    <div className={`wrapper ${isOver ? 'is-over' : ''}`} ref={drop}>
      {children}
    </div>
  )
}
