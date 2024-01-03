import { useDrag } from 'react-dnd'

type CardProps = {
  text: string
  isDragging?: boolean
}

export default function Card({ text }: CardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { id: text },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div className={`property ${isDragging ? 'is-dragging' : ''}`} ref={drag}>
      {text}
    </div>
  )
}
