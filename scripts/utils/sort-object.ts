export const sortObject = (obj: object) => {
  const keysSorted = Object.keys(obj).sort()
  const sortedObj = {}
  keysSorted.forEach(key => {
    sortedObj[key] = obj[key]
  })
  return sortedObj
}
