const internalPath = "/summary/"

export const getRouteFromPath = (path: string) => {
  // remove "static" and .xml extension
  const relativePathArr = path.replace(/\.xml$/, '').split("/")
  relativePathArr.shift()
  const relativePath = relativePathArr.join("/")
  return relativePath
}

export const getRelativePathFromInternalLink = (link: string) => {
  const relativePath = internalPath + link.replace(/\.xml$/, '')
  return relativePath
}