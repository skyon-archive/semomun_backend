exports.parseIntDefault = (str, def) => {
  const res = parseInt(str)
  return isNaN(res) ? def : res
}
