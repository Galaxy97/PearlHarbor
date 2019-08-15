let option
let userApikey
const socket = io('http://localhost:3000/battle', {
  reconnection: false,
})

socket.emit('getUserField', Cookies.get('apiKey'), Cookies.get('roomId'))

socket.on('userField', (player, playersApiKey) => { // length is number of enemy
  userApikey = player.apiKey
  playersApiKey.forEach(element => {
    if (userApikey !== element) {
      servicesCreateEnemyField(element)
      servicesShotResult(player.enemyField, element)
    }
  })
  servicesRenderUserField(player.matrix, player.superWeapon, player.ships)
})

function checkButton(x, y, apiKey) {
  servicesCheckButton(socket, x, y, apiKey)
}

socket.on('shotResult', (player) => {
  servicesShotResult(player.enemyField, player.apiKey)
})

socket.on('gameOver', (message) => {
  alert('GG! ' + message)
  location.replace('/')
})

