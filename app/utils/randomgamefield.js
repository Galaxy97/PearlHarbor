function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

const randomize = () => {
  const resultMatrix = []
  const ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]

  for (let i = 0; i < 10; i++) {
    const temp = []
    for (let j = 0; j < 10; j++) {
      temp[j] = 0
    }
    resultMatrix[i] = temp
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
      temparray.push([xIndex, yIndex])
    }
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
    for (let i = 0; i < 10; i++) {
      let str = ''
      for (let j = 0; j < 10; j++) {
        str += (resultMatrix[i][j]) + ' '
      }
      console.log(str)
    }
    console.log('\n\n')
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
  return resultMatrix
}

module.exports = { randomize }
