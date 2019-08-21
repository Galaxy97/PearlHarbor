const isOut = require('./checkHit').testObj.isOut
const checkHit = require('./checkHit').testObj.checkHit

const player1 = {
  matrix: [
    [0, 0, 0, 0, 0, 2, 2, 2, 2, 0],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    [0, 2, 0, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    [2, 0, 0, 2, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0, 0, 0, 2, 0],
    [0, 0, 2, 2, 2, 0, 0, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 2, 0, 0, 0]
  ],
  ships: [
    [[0, 5, false],
      [0, 6, false],
      [0, 7, false],
      [0, 8, false]],
    [[8, 2, false],
      [8, 3, false],
      [8, 4, false]],
    [[3, 6, false],
      [4, 6, false],
      [5, 6, false]],
    [[7, 8, false],
      [8, 8, false]],
    [[1, 0, false],
      [1, 1, false]],
    [[6, 0, false],
      [7, 0, false]],
    [[6, 3, false]],
    [[9, 6, false]],
    [[2, 8, false]],
    [[4, 1, false]]],
  shipsStatus: [false, false, false, false, false, false, false, false, false, false],
  enemyField: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
}

const player2 = {
  shipsStatus: new Array(10).fill(true)
}

test('ships status out test', () => {
  expect(isOut(player1)).toBe(false)
})

test('ships status keep test', () => {
  expect(isOut(player2)).toBe(true)
})

test('ship miss shot test', () => {
  expect(checkHit(0, 0, player2, player1)).toBe(false)
  expect(player1.matrix[0][0]).toEqual(1)
  expect(player1.enemyField[0][0]).toEqual(1)
})

test('ship hit shot test', () => {
  expect(checkHit(1, 0, player2, player1)).toBe(true)
  expect(player1.matrix[1][0]).toEqual(3)
  expect(player1.enemyField[1][0]).toEqual(2)
})

test('test perk rowStrike', () => {
  expect(checkHit(0, 0, player2, player1, 'rowStrike')).toBe(undefined)
  expect(player1.matrix[0]).toEqual([1, 1, 1, 1, 1, 3, 3, 3, 3, 1])
  expect(player1.enemyField[0]).toEqual([1, 1, 1, 1, 1, 2, 2, 2, 2, 1])
})

test('test perk columnStrike', () => {
  expect(checkHit(0, 0, player2, player1, 'columnStrike')).toBe(undefined)
  const column = player1.matrix.map(function (value, index) { return value[0] })
  const columnEnemy = player1.enemyField.map(function (value, index) { return value[0] })
  expect(column).toEqual([1, 3, 1, 1, 1, 1, 3, 3, 1, 1])
  expect(columnEnemy).toEqual([1, 2, 1, 1, 1, 1, 2, 2, 1, 1])
})

test('test perk 4xShot', () => {
  expect(checkHit(0, 0, player2, player1, '4xShot')).toBe(undefined)
  const tempMatrix = [player1.matrix[0][0], player1.matrix[0][1], player1.matrix[1][0], player1.matrix[1][1]]
  const tempEnemy = [player1.enemyField[0][0], player1.enemyField[0][1], player1.enemyField[1][0], player1.enemyField[1][1]]
  expect(tempMatrix).toEqual([1, 1, 3, 3])
  expect(tempEnemy).toEqual([1, 1, 2, 2])
})

test('test perk leftDiagonal', () => {
  expect(checkHit(0, 0, player2, player1, 'leftDiagonal')).toBe(undefined)
  const tempMatrix = []
  const tempEnemy = []
  for (let i = 0; i < 10; i++) {
    tempMatrix.push(player1.matrix[i][i])
    tempEnemy.push(player1.enemyField[i][i])
  }
  expect(tempMatrix).toEqual([1, 3, 1, 1, 1, 1, 1, 1, 3, 1])
  expect(tempEnemy).toEqual([1, 2, 1, 1, 1, 1, 1, 1, 2, 1])
})
test('test perk rightDiagonal', () => {
  expect(checkHit(0, 0, player2, player1, 'rightDiagonal')).toBe(undefined)
  const tempMatrix = []
  const tempEnemy = []
  for (let i = 9, j = 0; j < 10 || i >= 0; i--, j++) {
    tempMatrix.push(player1.matrix[i][j])
    tempEnemy.push(player1.enemyField[i][j])
  }
  expect(tempMatrix).toEqual([1, 1, 1, 3, 1, 1, 3, 1, 1, 1])
  expect(tempEnemy).toEqual([1, 1, 1, 2, 1, 1, 2, 1, 1, 1])
})
