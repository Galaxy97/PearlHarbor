function servicesCreateEnemyField(id) {
  const div = document.createElement('div')
  div.id = id
  const title = document.createElement('h3')
  title.innerText = 'Enemy field'
  const body = document.createElement('div')
  const weapon = document.createElement('div')
  div.appendChild(title)
  div.appendChild(body)
  div.appendChild(weapon)
  document.getElementById('grid').appendChild(div)
}

function servicesRenderUserField(arr, weapons, ships) {
  document.getElementById('user').innerHTML = '<h2>My field</h2>'
  renderField('user', document.getElementById('user'), arr)
  if (weapons !== undefined) {
    const ul = document.createElement('ul')
    weapons.forEach((element) => {
      const btn = document.createElement('li')
      btn.innerHTML = `<button id="${element}-btn" onclick = "superWeapon('${element}')">${element}</button>`
      ul.appendChild(btn)
    })
    document.getElementById('superWeapon').innerHTML = ''
    document.getElementById('superWeapon').appendChild(ul)
  }
  renderShips(document.getElementById('shipsUser'), ships)
}

function renderShips(obj, ships) {
  obj.innerHTML = ''
  const table = document.createElement('table')
  ships.forEach(element => {
    const tr = document.createElement('tr')
    element.forEach(chunk => {
      const td = document.createElement('td')
      let classbtn
      !chunk[2] ? classbtn = 'btnChunkShip' : classbtn = 'btnKill'
      td.innerHTML = `<input type="button" class="${classbtn}">`
      tr.appendChild(td)
    })
  table.appendChild(tr)  
  })
  obj.appendChild(table)
}

function servicesShotResult(arr, id) {
  debugger
  document.getElementById(id).children[1].innerHTML = ''
  renderField('enemy', document.getElementById(id).children[1], arr, id)
}

function cleanAll() {
  document.getElementById('content').innerHTML = ''
}

function superWeapon(weapon) {
  option = weapon
  document.getElementById(weapon + '-btn').remove()
  alert('Your will be used super weapon ' + weapon)
}

function servicesCheckButton(socket, x, y, apiKey) {
  socket.emit('shot', {
    roomId: Cookies.get('roomId'),
    idX: x,
    idY: y,
    option: option,
    enemyApiKey: apiKey
  })
  option = undefined
}

function renderField(type, obj, arr, id) {
  const table = document.createElement('table')
  table.align = 'center'
  for (let i = 0; i < 10; i++) {
    const tr = document.createElement('tr')
    for (let j = 0; j < 10; j++) {
      const td = document.createElement('td')
      let classbtn
      switch (type) {
        case 'enemy':
          if (arr[i][j] === 0) {
            classbtn = 'btnEmpty'
          }
          if (arr[i][j] === 1) {
            classbtn = 'btnLosser'
          }
          if (arr[i][j] === 2) {
            classbtn = 'btnKill'
          }

          if (arr[i][j] === 1 || arr[i][j] === 2) {
            td.innerHTML = `<input type="button" class="${classbtn}">`
          } else {
            td.innerHTML = `<input type="button" class="${classbtn}" onclick = "checkButton(${i}, ${j}, '${id}')">`
          }
          break
        case 'user':
          if (arr[i][j] === 0) {
            classbtn = 'btnEmpty'
          }
          if (arr[i][j] === 1) {
            classbtn = 'btnLosser'
          }
          if (arr[i][j] === 2) {
            classbtn = 'btnChunkShip'
          }
          if (arr[i][j] === 3) {
            classbtn = 'btnKill'
          }

          td.innerHTML = `<input type="button" class="${classbtn}">`
          break
        default:
          td.innerHTML = `<div class="btnEmpty" onclick ="checkButton(${i}, ${j}, '${id}')"></div>`
          break
      }
      tr.appendChild(td)
    }
    table.appendChild(tr)
  }
  obj.appendChild(table)
}
