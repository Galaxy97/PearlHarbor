let option
let userApikey
const socket = io('http://localhost:3000/battle', {
  reconnection: false,
})

socket.emit('getUserField', Cookies.get('apiKey'), Cookies.get('roomId'))

socket.on('userField', (player, playersApiKey) => { // length is number of enemy
  debugger
  userApikey = player.apiKey
  playersApiKey.forEach(element => {
    if (userApikey !== element) {
      if (document.getElementById(element)) {
        document.getElementById(element).remove()
      }
      servicesCreateEnemyField(element)
      servicesShotResult(player.enemyField, element)
    }
  })
  servicesRenderUserField(player.matrix, player.superWeapon, player.ships)
})

function checkButton(x, y, apiKey) {
  servicesCheckButton(socket, x, y, apiKey)
}

socket.on('shotResult', (player, enemyApiKey) => {
  servicesShotResult(player.enemyField, enemyApiKey)
})

socket.on('gameOver', (message) => {
  alert('GG! ' + message)
  location.replace('/')
})

