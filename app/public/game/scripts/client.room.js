const urlParams = new URLSearchParams(window.location.search)
const typeRoom = urlParams.get('type')

const socket = io('/room', {
  reconnection: false,
})
socket.emit('authentication', {
  apiKey: Cookies.get('apiKey'),
  typeRoom: typeRoom
})

socket.on('message', (data) => {
  Cookies.set('roomId', data.id) // id is roomId
  servicesCreateField(data)
})

socket.on('allPlayersInfo', (data) => {
  servicesCreateFields(data)
})

socket.on('letsBattle', () => {
  alert('letsBattle')
  location.replace('/game/battle')
})

function servicesCreateFields(data) {
  const divGrid = document.getElementById('grid')
  divGrid.innerHTML = ''
  data.forEach(element => {
    const field = document.createElement('div')
    field.innerHTML = `
      <p>Name : <strong> ${element.name} </strong></p>
      <p>Sessions : <strong> ${element.sessions}</strong></p>
      <p>Wins : <strong> ${element.wins}</strong></p>
      <p>LastPlayDate : <strong> ${new Date(element.wins).toLocaleString()}</strong></p>
    `
    divGrid.appendChild(field)
  })
}

function servicesCreateField(data) {
  const divGrid = document.getElementById('grid')
  const field = document.createElement('div')
  field.innerHTML = `
      <p>Name : <strong> ${data.playerInfo.name} </strong></p>
      <p>Sessions : <strong> ${data.playerInfo.sessions}</strong></p>
      <p>Wins : <strong> ${data.playerInfo.wins}</strong></p>
      <p>LastPlayDate : <strong> ${new Date(data.playerInfo.wins).toLocaleString()}</strong></p>
    `
  divGrid.appendChild(field)
}
