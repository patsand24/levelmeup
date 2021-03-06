var level = require('level')

module.exports = function (dir, callback) {
  var db = level(dir)
  var result = []
  var fetchNext = function (i) {
    db.get('key' + i, function (err, data) {
      if (err) {
        throw err
      }

      result.push(data)

      if (i === 100) {
        return db.close(callback.bind(null, null, result))
      }

      fetchNext(i + 1)
    })
  }
  fetchNext(0)
}
