let yourTurn
let option
let player

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
  } else {
    socket.emit('authentication', { 'apiKey': Cookies.get('apiKey') })
  }
  socket.on('messeage', (data) => {
    servicesMesseage(data)
  })

  socket.on('playerId', (playerId) => {
    Cookies.set('playerId', playerId, { expires: 0.01 })
  })

  socket.on('userRecovery', (data) => {
    cleanAll()
    renderGamePage()
    servicesRenderUserField(data.playerField, data.turn, data.superWeapon)
    document.getElementById('enemy').children[1].innerHTML = ''
    renderField('enemy', document.getElementById('enemy').children[1], data.enemyField)
  })

  socket.on('letsBattle', () => {
    setTimeout(() => {
      alert('start game')
      cleanAll()
      renderGamePage()
      servicesRenderUserField(player.matrix, yourTurn, player.superWeapon)
    }, 1500)
  })

  socket.on('infoPlayer2', (data) => {
    const enemyInfo = document.getElementById('enemyInfo')
    enemyInfo.innerHTML = renderInfo(data)
  })

  socket.on('shotResult', (data, turn) => {
    servicesShotResult(data, turn)
  })

  socket.on('won', (name) => {
    Cookies.remove('roomId')
    Cookies.remove('playerId')
    alert('Game finished! Player ' + name + ' won')
    location.replace('/')
  })

  function checkButton(x, y, object) {
    servicesCheckButton(socket, x, y)
  }
} else {
  location.replace('http://localhost:3000/login')
}