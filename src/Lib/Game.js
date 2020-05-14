let knightPosition = [1, 7]
let observer = null

function emitChange() {
  observe(knightPosition)
}

export function canMoveKnight(toX, toY) {
    const [x, y] = knightPosition
    console.log(toX,toY,"-",x,y)
    const dx = toX - x
    const dy = toY - y
    console.log("calc")
    console.log(Math.abs(dx),Math.abs(dy))
    
    return (
      (Math.abs(dx) === 2 && Math.abs(dy) === 1) || (Math.abs(dx) === 1 && Math.abs(dy) === 2)
    )
}

export function observe(o) {
    if (observer) {
      throw new Error('Multiple observers not implemented.')
    }
  
    observer = o
    emitChange()
}

export function moveKnight(toX, toY) {
  knightPosition = [toX, toY]
  emitChange()
}