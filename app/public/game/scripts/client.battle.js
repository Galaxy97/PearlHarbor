const socket = io('http://localhost:3000/battle', {
  reconnection: false,
})

socket.emit('getUserField', Cookies.get('apiKey'), Cookies.get('roomId'))

socket.on('userField', (player) => {
  servicesRenderUserField(player.matrix)
  servicesShotResult(player.enemyField, player.superWeapon)
})

function checkButton(x, y) {
  servicesCheckButton(socket, x, y)
}

socket.on('shotResult', (player) => {
  servicesShotResult(player.enemyField, player.superWeapon)
})
