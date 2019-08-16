let option
let userApikey
const socket = io('http://localhost:3000/battle', {
  reconnection: false,
})

socket.emit('getUserField', Cookies.get('apiKey'), Cookies.get('roomId'))

socket.on('userField', (player) => { // length is number of enemy
  servicesRenderUserField(player.matrix, player.superWeapon, player.ships)
})

socket.on('whoTurn', turn => {
  if (turn) {
    document.getElementById('turn').innerText = 'Your turn'
  } else {
    document.getElementById('turn').innerText = 'Your DON`T turn'
  }
})

socket.on('renderEnemyFields',(players, enemyApiKey) => {
  debugger
  players.forEach(element => {
    if (element.apiKey !== enemyApiKey) {
      if (document.getElementById(element.apiKey)) {
        document.getElementById(element.apiKey).remove()
      }
      servicesCreateEnemyField(element.apiKey)
      servicesShotResult(element.enemyField, element.apiKey)
    }
  })
})

function checkButton(x, y, apiKey) {
  servicesCheckButton(socket, x, y, apiKey)
}

socket.on('shotResult', (players, playerApiKey) => {
  debugger
  players.forEach( element => {
    if (element.apiKey !== playerApiKey) {
      servicesShotResult(element.enemyField, element.apiKey)
    }
  })
})

socket.on('gameOver', (message) => {
  alert('GG! ' + message)
  location.replace('/')
})

