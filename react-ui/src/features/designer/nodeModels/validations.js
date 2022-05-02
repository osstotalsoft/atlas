import { errorMessages } from '../constants/ErrorMessages'
import { nodeConfig } from '../constants/NodeConfig'

export const anyInOneOut = (inputLinks, outputLinks, type) => {
  if (inputLinks.length < 1 || outputLinks.length < 1) return [false, `${type} ${errorMessages.notLinked}.`]
  if (outputLinks.length > 1) return [false, `${type} ${errorMessages.multipleLinks}.`]

  return [true]
}

export const anyInAnyOut = (inputLinks, outputLinks, type) => {
  if (inputLinks.length < 1 || outputLinks.length < 1) return [false, `${type} ${errorMessages.notLinked}.`]

  return [true]
}

export const oneOut = (outputLinks, type) => {
  if (outputLinks?.length < 1) return [false, `${type} ${errorMessages.notLinked}.`]
  if (outputLinks?.length > 1) {
    const mes = type === nodeConfig.DECISION.type ? `${errorMessages.caseMultipleLinks}` : `${type} ${errorMessages.multipleLinks}.`
    return [false, mes]
  }

  return [true]
}

export const anyIn = (inputLinks, type) => {
  if (inputLinks.length < 1) return [false, `${type} ${errorMessages.notLinked}.`]
  return [true]
}
