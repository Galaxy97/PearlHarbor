const socket = io('http://localhost:3000/battle', {
  reconnection: false,
})

socket.emit('getUserField', Cookies.get('apiKey'), Cookies.get('roomId'))

socket.on('userField', (player, turnIndex) => {
  servicesRenderUserField(player.matrix, turnIndex, player.superWeapon)
  renderField('enemy', document.getElementById('enemy'), player.enemyField)
})

function checkButton(x, y) {
  servicesCheckButton(socket, x, y)
}

socket.on('shotResult', (data, turn) => {
  servicesShotResult(data, turn)
})
