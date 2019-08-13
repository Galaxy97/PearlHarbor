let yourTurn
let option
let player

if (Cookies.get('apiKey')) {
  const socket = io('http://localhost:3000', {
    reconnection: false
  })
  if (Cookies.get('roomId') && Cookies.get('playerId')) {
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

  socket.on('updateUserField', (arr, turn) => {
    servicesRenderUserField(arr.matrix, turn)
    servicesRendreShips('user', arr.ships)
  })

  socket.on('userRecovery', (data) => {
    debugger
    cleanAll()
    renderGamePage()
    servicesRenderUserField(data.playerField, data.turn, data.superWeapon)
    document.getElementById('enemy').children[1].innerHTML = ''
    renderField('enemy', document.getElementById('enemy').children[1], data.enemyField)
    servicesRendreShips('user', data.ships)
  })

  socket.on('letsBattle', () => {
    setTimeout(() => {
      alert('start game')
      cleanAll()
      renderGamePage()
      servicesRenderUserField(player.matrix, yourTurn, player.superWeapon)
      servicesRendreShips('user',player.ships, player.shipsStatus)
    }, 1500)
  })

  socket.on('enemyInfo', (data) => {
    const enemyInfo = document.getElementById('enemyInfo')
    enemyInfo.innerHTML = renderInfo(data)
  })

  socket.on('shotResult', (data, turn) => {
    servicesShotResult(data.enemyField, turn)
    // servicesRendreShips('enemy', data.ships)
  })

  socket.on('won', (name) => {
    Cookies.remove('roomId')
    Cookies.remove('playerId')
    alert('Game finished! Player ' + name + ' won')
    location.replace('/')
  })

  socket.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
      alert('disconnection. Try to reconnect automatly')
      Cookies.remove('roomId')
      Cookies.remove('playerId')
      location.reload()
    }
  })

  function checkButton(x, y, object) {
    servicesCheckButton(socket, x, y)
  }
} else {
  location.replace('http://localhost:3000/login')
}