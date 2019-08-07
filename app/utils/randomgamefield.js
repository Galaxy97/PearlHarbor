function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

const randomize = (id) => {
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
    let condition = getRandomInt(2)
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
    let itY = temparray[0][1] === 0 ? 0 : temparray[0][1] - 1
    let XLast = temparray[temparray.length - 1][0] === 9 ? 10 : temparray[temparray.length - 1][0] + 2
    let YLast = temparray[temparray.length - 1][1] === 9 ? 10 : temparray[temparray.length - 1][1] + 2
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
  let string = ''
  for (let i = 0; i < 10; i++) {
    let str = ''
    for (let j = 0; j < 10; j++) {
      str += (resultMatrix[i][j]) + ' '
    }
    string += (str + '\n')
  }
  console.log('\n\n\n\n')
  console.log(string)

  const result = {
    id: id,
    matrix: resultMatrix,
    ships: resultShips,
    shipsStatus: new Array(ships.length).fill(false),
    enemyField: emptyField
  }
  return result
}

const checkHit = (x, y, player1, player2) => {
  if (player2.matrix[x][y] === 2) {
    console.log('hit')
    player1.enemyField[x][y] = 2
    player2.matrix[x][y] = 3
    const shipIndex = findShipIndex(x, y, player2)
    if (isSink(player2, shipIndex)) {
      coverArea(player2.ships[shipIndex], player1.enemyField)
      console.log('sink')
    }
    console.log('submit')
  } else {
    console.log('havent hit')
    player1.enemyField[x][y] = 1
    player2.matrix[x][y] = 1
    console.log('submitted')
  }
  let string = ''
  for (let i = 0; i < 10; i++) {
    let str = ''
    for (let j = 0; j < 10; j++) {
      str += (player1.enemyField[i][j]) + ' '
    }
    string += (str + '\n')
  }
  console.log('\n\n' + string)
  string = ''
  for (let i = 0; i < 10; i++) {
    let str = ''
    for (let j = 0; j < 10; j++) {
      str += (player2.matrix[i][j]) + ' '
    }
    string += (str + '\n')
  }
  console.log('\n\n' + string)
}

function findShipIndex (x, y, player) {
  for (let i = 0; i < player.ships.length; i++) {
    for (let j = 0; j < player.ships[i].length; j++) {
      if (player.ships[i][j][0] === x && player.ships[i][j][1] === y) {
        player.ships[i][j][2] = true
        return i
      }
    }
  }
}

function isSink (player, index) {
  for (let i = 0; i < player.ships[index].length; i++) {
    if (player.ships[index][i][2] === false) {
      return false
    }
  }
  player.shipsStatus[index] = true
  return true
}

function coverArea (ship, enemyField) {
  let itX = ship[0][0] === 0 ? 0 : ship[0][0] - 1
  const itY = ship[0][1] === 0 ? 0 : ship[0][1] - 1
  const XLast = ship[ship.length - 1][0] === 9 ? 10 : ship[ship.length - 1][0] + 2
  const YLast = ship[ship.length - 1][1] === 9 ? 10 : ship[ship.length - 1][1] + 2
  for (itX; itX < XLast; itX++) {
    for (let j = itY; j < YLast; j++) {
      if (enemyField[itX][j] !== 2) {
        enemyField[itX][j] = 1
      }
    }
  }
}

module.exports = { randomize, checkHit }
