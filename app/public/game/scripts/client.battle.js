let option

const socket = io('http://localhost:3000/battle', {
  reconnection: false,
})

socket.emit('getUserField', Cookies.get('apiKey'), Cookies.get('roomId'))

socket.on('userField', (player, length) => { // length is number of enemy
  for (let index = 1; index < length; index++) {
    servicesCreateEnemyField()    
  }
  servicesRenderUserField(player.matrix, player.superWeapon, player.ships)
  servicesShotResult(player.enemyField)
})

function checkButton(x, y) {
  servicesCheckButton(socket, x, y)
}

socket.on('shotResult', (player) => {
  servicesShotResult(player.enemyField)
})

socket.on('gameOver', (message) => {
  alert('GG! ' + message)
  location.replace('/')
})

