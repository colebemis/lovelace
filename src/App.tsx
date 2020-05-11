import React from 'react'

export default function App() {
  return (
    <div>
      <Node id="stateA" x={100} y={200}></Node>
      <Node id="stateB" x={200} y={400}></Node>
    </div>
  )
}

interface NodeProps {
  id: string
  x: number
  y: number
}

function Node({ id, x, y }: NodeProps) {
  return (
    <div
      id={id}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        transform: 'translate(-50%, -50%)',
        padding: 16,
        border: '2px solid',
        borderRadius: 6,
      }}
    >
      ({x}, {y})
    </div>
  )
}
