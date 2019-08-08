let yourTurn
let option
if (Cookies.get('apiKey')) {
  const socket = io('http://localhost:3000', {
    reconnection: false
  })
  if (Cookies.get('roomId')) {
    alert('recovery last game')
    socket.emit('recovery', {
      roomId: Cookies.get('roomId'),
      playerId: Cookies.get('playerId')
    })
    cleanAll()
    renderGamePage()
    socket.emit('getMyFileld', Cookies.get('roomId'))
  } else {
    socket.emit('authentication', { 'apiKey': Cookies.get('apiKey') })
  }
  socket.on('messeage', (data) => {
    const playerInfo = document.getElementById('playerInfo')
    if (data.hasOwnProperty('player2')) {
      const enemyInfo = document.getElementById('enemyInfo')
      playerInfo.innerHTML = renderInfo(data.player1)
      enemyInfo.innerHTML = renderInfo(data.player2)
      yourTurn = data.yourTurn
    } else {
      yourTurn = data.yourTurn
      playerInfo.innerHTML = renderInfo(data.player1)
    }
    roomId = data.roomId
    Cookies.set('roomId', data.roomId, { expires: 0.01 })
  })

  socket.on('playerId', (playerId) => {
    Cookies.set('playerId', playerId, { expires: 0.01 })
  })

  socket.on('letsBattle', () => {
    setTimeout(() => {
      alert('start game')
      cleanAll()
      renderGamePage()
      socket.emit('getMyFileld', Cookies.get('roomId'))
    }, 1500)
  })

  socket.on('getUserField', (arr, turn) => {
    document.getElementById('user').innerHTML = ''
    if (turn) {
      document.getElementById('arrow').className = 'arrowRight'
    } else {
      document.getElementById('arrow').className = 'arrowLeft'
    }
    renderField('user', document.getElementById('user'), arr)
  })

  socket.on('infoPlayer2', (data) => {
    const enemyInfo = document.getElementById('enemyInfo')
    enemyInfo.innerHTML = renderInfo(data)
  })

  socket.on('shotResult', (data, turn) => {
    document.getElementById('enemy').innerHTML = ''
    if (turn) {
      document.getElementById('arrow').className = 'arrowRight'
    } else {
      document.getElementById('arrow').className = 'arrowLeft'
    }
    renderField('enemy', document.getElementById('enemy'), data)
  })

  socket.on('won', (name) => {
    Cookies.remove('roomId')
    Cookies.remove('playerId')
    alert('Game finished! Player ' + name + ' won')
    location.replace('/')
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
    const divArrow = document.createElement('div')
    divArrow.id = 'arrow'
    if (yourTurn) {
      divArrow.className = 'arrowRight'
    } else {
      divArrow.className = 'arrowLeft'
    }
    const divEnemy = document.createElement('div')
    divEnemy.id = 'enemy'
    divEnemy.align = 'center'
    divEnemy.innerHTML = '<h2>Enemy field</h2>'
    divContent.appendChild(divUser)
    divContent.appendChild(divArrow)
    divContent.appendChild(divEnemy)
    
    const names = ['rowStrike', '4xShot', 'diagonalStrike']
    names.forEach((element) => {
      const btn = document.createElement('div')
      btn.innerHTML = `<button id="${element}-btn" onclick = "superWeapon('${element}')">${element}</button>`
      divContent.appendChild(btn)
    })
    renderField('default', document.getElementById('enemy'))
  }

  function superWeapon(weapon){
    option = weapon
    document.getElementById(weapon + '-btn').remove()
    alert('Your will be used super weapon ' + weapon)
  }

  function checkButton(x, y, object) {
    socket.emit('shot', {
      roomId: Cookies.get('roomId'),
      idX: x,
      idY: y,
      option: option
    })
    option = undefined
  }

  function renderField(type, obj, arr) {
    const table = document.createElement('table')
    const caption = document.createElement('caption')
    if (type === 'enemy') {
      caption.innerText = 'Enemy Field'
    } else if (type === 'user') {
      caption.innerText = 'User Field'
    }
    table.appendChild(caption)
    for (let i = 0; i < 10; i++) {
      const tr = document.createElement('tr')
      for (let j = 0; j < 10; j++) {
        const td = document.createElement('td')
        let classbtn
        switch (type) {
          case 'enemy':
            if (arr[i][j] === 0) {
              classbtn = 'btnEmpty'
            }
            if (arr[i][j] === 1) {
              classbtn = 'btnLosser'
            }
            if (arr[i][j] === 2) {
              classbtn = 'btnKill'
            }

            if (arr[i][j] === 1 || arr[i][j] === 2) {
              td.innerHTML = `<input type="button" class="${classbtn}">`
            } else {
              td.innerHTML = `<input type="button" class="${classbtn}" onclick = "checkButton(${i}, ${j}, this)">`
            }
            break
          case 'user':
            if (arr[i][j] === 0) {
              classbtn = 'btnEmpty'
            }
            if (arr[i][j] === 1) {
              classbtn = 'btnLosser'
            }
            if (arr[i][j] === 2) {
              classbtn = 'btnChunkShip'
            }
            if (arr[i][j] === 3) {
              classbtn = 'btnKill'
            }

            td.innerHTML = `<input type="button" class="${classbtn}">`
            break
          default:
            td.innerHTML = `<div class="btnEmpty" onclick ="checkButton(${i}, ${j}, this)"></div>`
            break
        }
        tr.appendChild(td)
      }
      table.appendChild(tr)
    }
    obj.appendChild(table)
  }
} else {
  location.replace('http://localhost:3000/login')
}