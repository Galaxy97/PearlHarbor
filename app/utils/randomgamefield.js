function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

const randomize = () => {
  const resultMatrix = []
  const resultShips = []
  const ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]

  for (let i = 0; i < 10; i++) {
    const temp = []
    for (let j = 0; j < 10; j++) {
      temp[j] = 0
    }
    resultMatrix[i] = temp
  }
  const emptyField = []
  for (let i = 0; i < 10; i++) {
    const temp = []
    for (let j = 0; j < 10; j++) {
      temp[j] = 0
    }
    emptyField[i] = temp
  }

  for (let shipIndex = 0; shipIndex < ships.length; shipIndex++) {
    let maxHeight = 9
    let maxWidth = 9
    const condition = getRandomInt(2)
    if (ships[shipIndex] !== 1) {
      maxHeight = condition ? 9 - ships[shipIndex] : 9
      maxWidth = condition ? 9 : 9 - ships[shipIndex]
    }
    const horizontalPosition = getRandomInt(maxWidth + 1)
    const verticalPosition = getRandomInt(maxHeight + 1)
    let status = true
    for (let i = 0; i < ships[shipIndex]; i++) {
      if (resultMatrix[horizontalPosition + (condition ? 0 : i)][verticalPosition + (condition ? i : 0)] !== 0) {
        status = false
      }
    }
    if (!status) {
      shipIndex--
      continue
    }
    const temparray = []
    for (let i = 0; i < ships[shipIndex]; i++) {
      const xIndex = horizontalPosition + (condition ? 0 : i)
      const yIndex = verticalPosition + (condition ? i : 0)
      resultMatrix[xIndex][yIndex] = 2
      temparray.push([xIndex, yIndex, false])
    }
    resultShips.push(temparray)
    let itX = temparray[0][0] === 0 ? 0 : temparray[0][0] - 1
    const itY = temparray[0][1] === 0 ? 0 : temparray[0][1] - 1
    const XLast = temparray[temparray.length - 1][0] === 9 ? 10 : temparray[temparray.length - 1][0] + 2
    const YLast = temparray[temparray.length - 1][1] === 9 ? 10 : temparray[temparray.length - 1][1] + 2
    for (itX; itX < XLast; itX++) {
      for (let j = itY; j < YLast; j++) {
        if (resultMatrix[itX][j] !== 2) {
          resultMatrix[itX][j] = 1
        }
      }
    }
  }
  for (const outer in resultMatrix) {
    for (const inner in resultMatrix[outer]) {
      if (resultMatrix[outer][inner] === 1) {
        resultMatrix[outer][inner] = 0
      }
    }
  }
  const result = {
    matrix: resultMatrix,
    ships: resultShips,
    shipsStatus: new Array(ships.length).fill(false),
    enemyField: emptyField
  }
  return result
}

module.exports = { randomize }
