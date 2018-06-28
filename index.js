const fs = require('fs')
const schedule = require('./fns/schedule'); // функции
const data = require('./data'); // данные

fs.writeFileSync('./schedule.json', JSON.stringify(schedule(data)))
