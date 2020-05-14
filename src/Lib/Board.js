import React from 'react'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import Knight from './Knight'
import BoardSquare from './BoardSquare'
import { canMoveKnight, moveKnight } from './Game'

function renderSquare(i, knightPosition) {
    const x = i % 8
    const y = Math.floor(i / 8)

    return <div onClick={() => handleSquareClick(x, y)}> 
      <div key={i} style={{ width: '50px', height: '50px' }}>
        <BoardSquare x={x} y={y}>
          {renderPiece(x, y, knightPosition)}
        </BoardSquare>
      </div>
     </div>
}
function handleSquareClick(toX, toY) {
    console.log("clicked",toX,toY);
    console.log(canMoveKnight(toX, toY));
    if (canMoveKnight(toX, toY)) {
        moveKnight(toX, toY)
    }
}
function renderPiece(x, y, [knightX, knightY]) {
    if (x === knightX && y === knightY) {
        return <Knight />
    }
}

export default function Board({ knightPosition }) {
  const squares = []

  for (let i = 0; i < 64; i++) {
    squares.push(renderSquare(i, knightPosition))
  }

  return <DndProvider backend={Backend}> 
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      {squares}
    </div>
   </DndProvider>
}