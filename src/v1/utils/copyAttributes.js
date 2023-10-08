module.exports = (objTo, objFrom, keys) => {
  keys.forEach(key => {
    objTo[key] = objFrom[key]
  });
}