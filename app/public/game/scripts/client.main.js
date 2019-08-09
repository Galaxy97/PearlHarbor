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
    servicesMesseage(data)
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
    servicesGetUserField(arr, turn)
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