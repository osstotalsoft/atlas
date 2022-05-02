export const generateFreeText = ({ workflowType, version, workflowId, status }, exact = false) => {
  let queryArray = new Array()

  if (workflowType) {
    let search = ''
    for (let i = 0; i < workflowType.length; i++) {
      search += `[${workflowType[i].toUpperCase()}${workflowType[i].toLowerCase()}]`
    }
    queryArray.push(exact ? `(workflowType:/${search}/)` : `(workflowType:/.*${search}.*/)`)
  }
  if (workflowId) {
    queryArray.push(`(workflowId:${workflowId.trim()})`)
  }
  if (version) {
    queryArray.push(`(version:${version})`)
  }
  if (status) {
    queryArray.push(`(status:${status})`)
  }
  return queryArray.join('AND')
}
