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
  if (player2.matrix[x][y] === 2) { // if some ship is hit
    console.log('hit')
    player1.enemyField[x][y] = 2
    player2.matrix[x][y] = 3
    const shipIndex = findShipIndex(x, y, player2) // search the ship that have hit
    if (isSank(player2, shipIndex)) { // check if ship have sank
      coverArea(player2.ships[shipIndex], player1.enemyField) // if it is we're covering area around it with 1's, that means the area is hit
      console.log('sink')
      console.log('submit')
      displayFields(player1, player2)
      return true
    }
    console.log('submit')
    displayFields(player1, player2)
    return true
  } else {
    console.log('havent hit') // if none ship is hit just macking the cell is 1,
    player1.enemyField[x][y] = 1
    player2.matrix[x][y] = 1
    console.log('submitted')
    displayFields(player1, player2)
    return false
  }
}

function displayFields (player1, player2) {
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
  for (let i = 0; i < player.ships.length; i++) { // we are using array 'ships' that has all coordinates of every ship and searching hit cell in it
    for (let j = 0; j < player.ships[i].length; j++) {
      if (player.ships[i][j][0] === x && player.ships[i][j][1] === y) {
        player.ships[i][j][2] = true
        return i // and returning its index
      }
    }
  }
}

function isSank (player, index) {
  for (let i = 0; i < player.ships[index].length; i++) { // checking if the ship has cells that wasn't hit
    if (player.ships[index][i][2] === false) {
      return false
    }
  }
  player.shipsStatus[index] = true
  return true
}

function coverArea (ship, enemyField) { // to cover area around ship we need to set value 1 in cells that are around the ship
  let itX = ship[0][0] === 0 ? 0 : ship[0][0] - 1 // also we need to check if that area not goes beyond bounds of matrix
  const itY = ship[0][1] === 0 ? 0 : ship[0][1] - 1
  const XLast = ship[ship.length - 1][0] === 9 ? 10 : ship[ship.length - 1][0] + 2
  const YLast = ship[ship.length - 1][1] === 9 ? 10 : ship[ship.length - 1][1] + 2
  for (itX; itX < XLast; itX++) {
    for (let j = itY; j < YLast; j++) { // loop that actually fills computed area
      if (enemyField[itX][j] !== 2) {
        enemyField[itX][j] = 1
      }
    }
  }
}

function finishGame (player1, player2) { // checking if players have ships yet. If he's not - finishing game
  for (let i = 0; i < player1.shipsStatus.length; i++) {
    if (player1.shipsStatus[i] === false) {
      return false
    }
  }
  for (let i = 0; player2.shipsStatus.length; i++) {
    if (player2.ships[i] === false) {
      return false
    }
  }
  return true
}

module.exports = { randomize, checkHit, finishGame }
