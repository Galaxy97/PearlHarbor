const checkHit = (x, y, player1, player2, option) => {
  if (option === undefined) {
  // if some ship is hit
    if (player2.matrix[x][y] === 2) {
      player2.enemyField[x][y] = 2
      player2.matrix[x][y] = 3
      // search the ship that have hit
      const shipIndex = findShipIndex(x, y, player2)
      // check if ship have sank
      if (isSank(player2, shipIndex)) {
        // if it is we're covering area around it with 1's, that means the area is hit
        coverArea(player2.ships[shipIndex], player2.enemyField, player2.matrix)
        return true
      }
      return true
    } else if (player2.matrix[x][y] !== 3) {
      // if none ship is hit just macking the cell is 1
      player2.enemyField[x][y] = 1
      player2.matrix[x][y] = 1
      return false
    }
  }
  if (option === 'rowStrike') {
    for (let i = 0; i < 10; i++) {
      checkHit(x, i, player1, player2)
    }
  }
  if (option === 'columnStrike') {
    for (let j = 0; j < 10; j++) {
      checkHit(j, y, player1, player2)
    }
  }
  if (option === '4xShot') {
    const xleft = x === 9 ? 8 : x
    const xRight = xleft + 1
    const yUpper = y === 9 ? 8 : y
    const yLower = yUpper + 1
    for (let i = xleft; i <= xRight; i++) {
      checkHit(i, yLower, player1, player2)
      checkHit(i, yUpper, player1, player2)
    }
  }
  if (option === 'leftDiagonal') {
    for (let i = 0; i < 10; i++) {
      checkHit(i, i, player1, player2)
    }
  }
  if (option === 'rightDiagonal') {
    for (let i = 9, j = 0; j < 10 || i > 0; i--, j++) {
      checkHit(i, j, player1, player2)
    }
  }
  if (option === 'boundsStrike100') {
    for (let i = 0; i < 10; i += 9) {
      for (let j = 0; j < 10; j++) {
        checkHit(i, j, player1, player2)
      }
    }
    for (let j = 0; j < 10; j += 9) {
      for (let i = 1; i < 9; i++) {
        checkHit(i, j, player1, player2)
      }
    }
  }
}

function findShipIndex (x, y, player) {
  // we are using array 'ships' that has all coordinates of every ship and searching hit cell in it
  for (let i = 0; i < player.ships.length; i++) {
    for (let j = 0; j < player.ships[i].length; j++) {
      if (player.ships[i][j][0] === x && player.ships[i][j][1] === y) {
        player.ships[i][j][2] = true
        // and returning its index
        return i
      }
    }
  }
}

function isSank (player, index) {
  // checking if the ship has cells that wasn't hit
  for (let i = 0; i < player.ships[index].length; i++) {
    if (player.ships[index][i][2] === false) {
      return false
    }
  }
  player.shipsStatus[index] = true
  return true
}

function coverArea (ship, enemyField, matrix) {
  // to cover area around ship we need to set value 1 in cells that are around the ship
  // also we need to check if that area not goes beyond bounds of matrix
  let itX = ship[0][0] === 0 ? 0 : ship[0][0] - 1
  const itY = ship[0][1] === 0 ? 0 : ship[0][1] - 1
  const XLast = ship[ship.length - 1][0] === 9 ? 10 : ship[ship.length - 1][0] + 2
  const YLast = ship[ship.length - 1][1] === 9 ? 10 : ship[ship.length - 1][1] + 2
  for (itX; itX < XLast; itX++) {
    // loop that actually fills computed area
    for (let j = itY; j < YLast; j++) {
      if (enemyField[itX][j] !== 2) {
        enemyField[itX][j] = 1
        matrix[itX][j] = 1
      }
    }
  }
}

// checking if players have ships yet. If he's not - finishing game
function isFinishGame (room) {
  let winnerApiKey
  let playerCount = 0
  for (let i = 0; i < room.players.length; i++) {
    for (let j = 0; j < room.players[i].shipsStatus.length; j++) {
      if (room.players[i].shipsStatus[j] === false) {
        winnerApiKey = room.players[i].apiKey
        playerCount++
        j = 13
      }
    }
    if (playerCount === 2) {
      return false
    }
  }
  room.winnerApiKey = winnerApiKey
  return true
}

function isOut (player) {
  for (let i = 0; i < player.shipsStatus.length; i++) {
    if (player.shipsStatus[i] === false) {
      return false
    }
  }
  return true
}

const testObj = { isOut, isFinishGame, coverArea, isSank, findShipIndex, checkHit }

module.exports = { checkHit, isFinishGame, isOut, testObj }
