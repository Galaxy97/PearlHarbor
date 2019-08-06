const socket = io('http://localhost:3000')
socket.emit('authentication', { 'apiKey': Cookies.get('apiKey') })

socket.on('messeage', (data) => {
  debugger
  const playerInfo = document.getElementById('playerInfo')
  if (data.hasOwnProperty('player2')) {
    const enemyInfo = document.getElementById('enemyInfo')
    playerInfo.innerHTML = renderInfo(data.player1)
    enemyInfo.innerHTML = renderInfo(data.player2)
  } else {
    playerInfo.innerHTML = renderInfo(data.player1)
  }
})
socket.on('letsBattle', () => {
  setTimeout(() => {
    console.log('start game')
  }, 1500)
})
socket.on('infoPlayer2', (data) => {
  const enemyInfo = document.getElementById('enemyInfo')
    enemyInfo.innerHTML = renderInfo(data)
})

function renderInfo(data) {
  return `
  <p> User name : <strong>${data.name}</strong> </p>
  <p> Sessions played : <strong>${data.sessions}</strong> </p>
  <p> Wins : <strong>${data.wins}</strong> </p>
  <p> Last played : <strong>${new Date(data.lastPlayDate).toLocaleString()}</strong> </p>
`
}