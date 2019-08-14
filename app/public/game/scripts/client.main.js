let yourTurn
let option
let player

if (Cookies.get('apiKey')) {
  const socket = io('http://localhost:3000', {
  query: 'roomType=2', 
  transports: ['websocket'], 
  upgrade: false,
  reconnection: false, 
  pingTimeout: 60000000,
  pingInterval: 25000000
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
  socket.on('message', (data) => {
    servicesMessage(data)
  })

  socket.on('playerId', (playerId) => {
    Cookies.set('playerId', playerId, { expires: 0.01 })
  })

  socket.on('updateUserField', (arr, turn) => {
    servicesRenderUserField(arr, turn)
  })

  // socket.on('userRecovery', (data) => {
  //   cleanAll()
  //   renderGamePage()
  //   servicesRenderUserField(data.playerField, data.turn, data.superWeapon)
  //   document.getElementById('enemy').children[1].innerHTML = ''
  //   renderField('enemy', document.getElementById('enemy').children[1], data.enemyField)
  // })

  socket.on('letsBattle', () => {
    setTimeout(() => {
      alert('start game')
      cleanAll()
      renderGamePage()
      servicesRenderUserField(player.matrix, yourTurn, player.superWeapon)
    }, 1500)
  })

  socket.on('enemyInfo', (data) => {
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
