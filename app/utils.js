exports.parseIntDefault = (str, def) => {
  const res = parseInt(str)
  return isNaN(res) ? def : res
}

exports.parseIntList = (l) => l.filter((x) => x !== '').map((x) => +x)
