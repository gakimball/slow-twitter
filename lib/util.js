const mapEntries = (object, mapper) => {
  return Object.fromEntries(Object.entries(object).map(mapper))
}

exports.mapEntries = mapEntries
