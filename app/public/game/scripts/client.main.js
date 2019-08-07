const socket = io('http://localhost:3000')
socket.emit('authentication', { 'apiKey': Cookies.get('apiKey') })

socket.on('messeage', (data) => {
  const playerInfo = document.getElementById('playerInfo')
  if (data.hasOwnProperty('player2')) {
    const enemyInfo = document.getElementById('enemyInfo')
    playerInfo.innerHTML = renderInfo(data.player1)
    enemyInfo.innerHTML = renderInfo(data.player2)
  } else {
    playerInfo.innerHTML = renderInfo(data.player1)
  }
})
socket.on('letsBattle', () => {
  setTimeout(() => {
    alert('start game')
    cleanAll()
    renderGamePage()
    socket.emit('getMyFileld')
  }, 1500)
})

socket.on('getUserField', (arr) => {
  document.getElementById('user').innerHTML = ''
  renderUserField(document.getElementById('user'), arr)
})

socket.on('infoPlayer2', (data) => {
  const enemyInfo = document.getElementById('enemyInfo')
  enemyInfo.innerHTML = renderInfo(data)
})

function renderInfo(data) {
  return `
  <p> User name : <strong>${data.name}</strong> </p>
  <p> Sessions played : <strong>${data.sessions}</strong> </p>
  <p> Wins : <strong>${data.wins}</strong> </p>
  <p> Last played : <strong>${new Date(data.lastPlayDate).toLocaleString()}</strong> </p>
`
}

function cleanAll() {
  document.getElementById('content').innerHTML = ''
}

function renderGamePage() {
  const divContent = document.getElementById('content')
  const header = document.createElement('header')
  header.innerHTML = '<h1> Sea Battle </h1> <hr>'
  header.style.textAlign = 'center'
  divContent.appendChild(header)

  const divUser = document.createElement('div')
  divUser.id = 'user'
  divUser.align = 'center'
  divUser.innerHTML = '<h2>My field</h2>'
  const divEnemy = document.createElement('div')
  divEnemy.id = 'enemy'
  divEnemy.align = 'center'
  divEnemy.innerHTML = '<h2>Enemy field</h2>'
  divContent.appendChild(divUser)
  divContent.appendChild(divEnemy)

  renderDefaultField(document.getElementById('enemy'))
}

function checkButton(x, y, object) {
  socket.emit('shot', {
    idX: x,
    idY: y
  })
}
socket.on('shotResult', (data) => {
  document.getElementById('enemy').innerHTML = ''
  renderEnemyField(document.getElementById('enemy'), data)
})

function renderDefaultField(obj) {
  const table = document.createElement('table')
  for (let i = 0; i < 10; i++) {
    const tr = document.createElement('tr')
    for (let j = 0; j < 10; j++) {
      const td = document.createElement('td')
      td.innerHTML = `<div class="btnEmpty" onclick ="checkButton(${i}, ${j}, this)"></div>`
      tr.appendChild(td)
    }
    table.appendChild(tr)
  }
  obj.appendChild(table)
}

function renderUserField(obj, arr) {
  const table = document.createElement('table')
  for (let i = 0; i < 10; i++) {
    const tr = document.createElement('tr')
    for (let j = 0; j < 10; j++) {
      const td = document.createElement('td')
      let classbtn
      if(arr[i][j] === 0) {
        classbtn = 'btnEmpty'
      }
      if(arr[i][j] === 1) {
        classbtn = 'btnLosser'
      }
      if(arr[i][j] === 2) {
        classbtn = 'btnChunkShip'
      }
      if(arr[i][j] === 3) {
        classbtn = 'btnKill'
      }

      td.innerHTML = `<input type="button" class="${classbtn}">`
      tr.appendChild(td)
    }
    table.appendChild(tr)
  }
  obj.appendChild(table)
}

function renderEnemyField(obj, arr) {
  const table = document.createElement('table')
  for (let i = 0; i < 10; i++) {
    const tr = document.createElement('tr')
    for (let j = 0; j < 10; j++) {
      const td = document.createElement('td')
      let classbtn
      if(arr[i][j] === 0) {
        classbtn = 'btnEmpty'
      }
      if(arr[i][j] === 1) {
        classbtn = 'btnLosser'
      }
      if(arr[i][j] === 2) {
        classbtn = 'btnKill'
      }

      if(arr[i][j] === 1 || arr[i][j] === 2) {
        td.innerHTML = `<input type="button" class="${classbtn}">`
      } else {
        td.innerHTML = `<input type="button" class="${classbtn}" onclick = "checkButton(${i}, ${j}, this)">`
      }
      tr.appendChild(td)
    }
    table.appendChild(tr)
  }
  obj.appendChild(table)
}
