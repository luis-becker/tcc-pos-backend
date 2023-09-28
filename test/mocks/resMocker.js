function resMocker() {
  var res = {}
  res.code = null
  res.message = null
  res.send = function(message) {
    res.message = message
    return res
  }
  res.status = function(code) {
    res.code = code
    return res
  }
  return res
}

module.exports = resMocker