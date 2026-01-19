const chalk = require('chalk')

function getTime(t) {
  return t < 10 ? '0' + t : t
}

const date = new Date()
const time = date.toLocaleDateString() + ' ' + `${getTime(date.getHours())}:${getTime(date.getMinutes())}:${getTime(date.getSeconds())}`

const error = (event, message) => {
  console.log(`[${chalk.blue(time)}] ${chalk.red('[ERROR]')} ${event.toUpperCase()} Ground - ${chalk.red(message)}`)
}

const info = (event, message) => {
  console.log(`[${chalk.blue(time)}] ${chalk.cyan('[INFO]')} ${event.toUpperCase()} Ground - ${chalk.cyan(message)}`)
}

const warn = (event, message) => {
  console.log(`[${chalk.blue(time)}] ${chalk.yellow('[WARN]')} ${event.toUpperCase()} Ground - ${chalk.yellow(message)}`)
}

module.exports = {
  error,
  info,
  warn
}