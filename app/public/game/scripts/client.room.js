const urlParams = new URLSearchParams(window.location.search)
const typeRoom = urlParams.get('type')

const socket = io('http://localhost:3000/room', {
  reconnection: false,
})
socket.emit('authentication', {
  apiKey: Cookies.get('apiKey'),
  typeRoom: typeRoom
})

socket.on('message', (data) => {
  alert('see console')
  console.log(data)
})

socket.on('allPlayersInfo', (data) => {
  alert('allPlayersInfo see console')
  console.log(data)
})

socket.on('letsBattle', () => {
  alert('letsBattle')
  location.replace('/game/battle')
})