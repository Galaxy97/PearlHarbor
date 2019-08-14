module.exports = (io) => {
  require('./room.socket')(io)
  require('./battle.socket')(io)
}
