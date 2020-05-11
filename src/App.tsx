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

function Edge({ id, from, to }: EdgeProps) {
  return (
    <>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <foreignObject
        x={Math.min(from.x, to.x)}
        y={Math.min(from.y, to.y)}
        width={Math.abs(from.x - to.x)}
        height={Math.abs(from.y - to.y)}
        style={{ overflow: 'visible' }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '4px 8px',
            background: 'black',
            color: 'white',
            borderRadius: 999,
          }}
        >
          {id}
        </div>
      </foreignObject>
    </>
  )
}
