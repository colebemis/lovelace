import React from 'react'

interface Dictionary<T> {
  [key: string]: T
}

interface Node {
  id: string
  x: number
  y: number
}

interface Edge {
  id: string
  from: string
  to: string
}

export default function App() {
  const [nodes, setNodes] = React.useState<Dictionary<Node>>({
    stateA: { id: 'stateA', x: 100, y: 200 },
    stateB: { id: 'stateB', x: 200, y: 400 },
    stateC: { id: 'stateC', x: 500, y: 100 },
  })

  const [edges, setEdges] = React.useState<Dictionary<Edge>>({
    eventA: { id: 'eventA', from: 'stateA', to: 'stateB' },
    eventB: { id: 'eventB', from: 'stateB', to: 'stateC' },
  })

  return (
    <div>
      <svg viewBox="0 0 600 600" width={600} height={600}>
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 12"
            refX="9"
            refY="6"
            markerWidth="5"
            markerHeight="6"
            orient="auto-start-reverse"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 1 1 L 9 6 L 1 11 z" />
          </marker>
        </defs>
        {Object.values(edges).map(({ id, from, to }) => (
          <Edge key={id} id={id} from={nodes[from]} to={nodes[to]} />
        ))}
      </svg>
      {Object.values(nodes).map(({ id, x, y }) => (
        <Node
          key={id}
          id={id}
          x={x}
          y={y}
          setNode={(node) => setNodes({ ...nodes, [id]: node })}
        />
      ))}
    </div>
  )
}

interface NodeProps {
  id: string
  x: number
  y: number
  setNode: (node: Node) => void
}

function Node({ id, x, y, setNode }: NodeProps) {
  const el = React.useRef<HTMLDivElement>(null)

  // Inspired by https://javascript.info/mouse-drag-and-drop
  function handleMouseDown(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) {
    if (!el.current) {
      return
    }

    const rect = el.current.getBoundingClientRect()
    const offsetX = event.clientX - (rect.left + rect.width / 2)
    const offsetY = event.clientY - (rect.top + rect.height / 2)

    function handleMouseMove(event: MouseEvent) {
      setNode({ id, x: event.pageX - offsetX, y: event.pageY - offsetY })
    }

    document.addEventListener('mousemove', handleMouseMove)

    el.current.onmouseup = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (el.current) {
        el.current.onmouseup = null
      }
    }
  }

  return (
    <div
      ref={el}
      id={id}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        transform: 'translate(-50%, -50%)',
        padding: 16,
        border: '2px solid',
        borderRadius: 6,
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      {id} ({x}, {y})
    </div>
  )
}

interface EdgeProps {
  id: string
  from: Node
  to: Node
}

interface Point {
  x: number
  y: number
}

function Edge({ id, from, to }: EdgeProps) {
  const [point1, setPoint1] = React.useState<Point | null>(null)
  const [point2, setPoint2] = React.useState<Point | null>(null)

  React.useLayoutEffect(() => {
    const fromRect = document.getElementById(from.id)?.getBoundingClientRect()
    const toRect = document.getElementById(to.id)?.getBoundingClientRect()

    if (fromRect) {
      setPoint1({
        x: fromRect.left + fromRect.width / 2,
        y: fromRect.top + fromRect.height,
      })
    }

    if (toRect) {
      setPoint2({
        x: toRect.left + toRect.width / 2,
        y: toRect.top,
      })
    }
  }, [from, to])

  return point1 && point2 ? (
    <>
      <line
        x1={point1.x}
        y1={point1.y}
        x2={point2.x}
        y2={point2.y}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        markerEnd="url(#arrow)"
      />
      <foreignObject
        x={Math.min(point1.x, point2.x)}
        y={Math.min(point1.y, point2.y)}
        width={Math.abs(point1.x - point2.x)}
        height={Math.abs(point1.y - point2.y)}
        style={{ overflow: 'visible', pointerEvents: 'none' }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '4px 8px',
              background: 'var(--text)',
              color: 'var(--background)',
              borderRadius: 999,
            }}
          >
            {id}
          </div>
        </div>
      </foreignObject>
    </>
  ) : null
}
