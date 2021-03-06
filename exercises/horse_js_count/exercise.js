module.exports = require('../../lib/exercise')({
  dir: __dirname,
  init: function () {
    var horseJs = require('../../data/horse_js.json')
    var start = new Date(horseJs[0].key)
    var end = new Date(horseJs[horseJs.length - 1].key)
    var newDate = function () {
      var mark = new Date(start.getTime() + Math.floor(Math.random() * (end.getTime() - start.getTime())))
      return mark.getFullYear() + '-' + (mark.getUTCMonth() < 9 ? '0' : '') + (mark.getUTCMonth() + 1) + '-' + (mark.getUTCDate() < 9 ? '0' : '') + (mark.getUTCDate() + 1)
    }
    var startDates = [newDate(), newDate(), newDate(), newDate()]
    return {
      prepare: function (db, callback) {
        db.batch(horseJs, callback)
      },
      exec: function (dbDir, mod, callback) {
        if (typeof mod !== 'function') {
          throw String('{error.mod.not_function}')
        }
        if (mod.length < 3) {
          throw String('{error.mod.not_long_enough}')
        }
        var dates = startDates.concat()
        var result = []
        var next = function () {
          mod(dbDir, dates.shift(), function (err, data) {
            result.push(data)
            if (dates.length === 0 || err) {
              callback(err, result)
            } else {
              next()
            }
          })
        }
        next()
      }
    }
  }
})
