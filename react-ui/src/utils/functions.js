import { curry, without, intersection, isEmpty, not, keys, descend, prop, ascend, sortWith } from 'ramda'

export const extractExactAge = (birthday, referenceDate) => {
  var differenceInMilisecond = Date.parse(referenceDate) || Date.now() - Date.parse(birthday)

  var years = Math.floor(differenceInMilisecond / 31536000000)
  var days = Math.floor((differenceInMilisecond % 31536000000) / 86400000)
  var months = Math.floor(days / 30)

  days = days % 30

  if (isNaN(years) || isNaN(months) || isNaN(days)) {
    return {}
  } else {
    return {
      years,
      months,
      days
    }
  }
}

// valueOrDefault :: a -> a -> a
export const valueOrDefault = curry(($default, value) => value ?? $default)

// withoutItem :: a -> [a] -> [a]
export const withoutItem = curry((x, xs) => xs |> without([x]))

export const intersect = (needed = [], received = []) => intersection(needed, received) |> isEmpty |> not

export const isNullOrWhitespace = str => !str || /^\s*$/.test(str)

// transformToDate :: String -> Date
export const transformToDate = str => new Date(str)

// addDays :: Int -> Date -> Date
export const addDays = curry((days, date) => {
  let localMutable = new Date(date)
  localMutable.setDate(localMutable.getDate() + days)
  return localMutable
})

// addOneDay :: Date -> Date
export const addOneDay = addDays(1)

// addMilliseconds :: Int -> Date -> Date
export const addMilliseconds = curry((milliseconds, date) => new Date(date.getTime() + milliseconds))

// subtractOneMillisecond :: Date -> Date
export const subtractOneMillisecond = addMilliseconds(-1)

export const isJsonString = str => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

import { allPass, defaultTo, filter, includes, pipe, propOr, toPairs, toUpper, pickBy } from 'ramda'
import { emptyArray, emptyString } from 'utils/constants'

const getValue = propOr(emptyString)
const includeFunction = ([name, value]) => pipe(getValue(name), toUpper, includes(value.toUpperCase()))
const makeFilter = keyValues => filter(allPass(keyValues.map(includeFunction)))
const defaultToEmptyList = defaultTo(emptyArray)
export const filterList = filters => pipe(defaultToEmptyList, makeFilter(toPairs(pickBy(value => value != null, filters))))

export const hash = () => Math.random().toString(36).toUpperCase().substr(2, 4)

export const objectReplaceKey = (object, oldKey, newKey) => {
  let newObject = {}
  keys(object).forEach(key => {
    if (key === oldKey) {
      let newPair = { [newKey]: object[oldKey] }
      newObject = { ...newObject, ...newPair }
    } else {
      newObject = { ...newObject, [key]: object[key] }
    }
  })
  return newObject
}

export const getFileContents = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const content = reader.result
      resolve(content)
    }
    reader.onerror = e => {
      reject(e)
    }
    reader.readAsText(file)
  })

export const removeEmpty = obj => {
  return Object.entries(obj)
    .filter(([_, v]) => v != null)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v === Object(v) ? removeEmpty(v) : v }), {})
}

export const sortBy = curry((field, direction, array) => {
  switch (direction) {
    case 'DESC':
      return sortWith([descend(prop(field))], array)
    case 'ASC':
      return sortWith([ascend(prop(field))], array)
    default:
      return sortWith([descend(prop(field))], array)
  }
})

export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)+)|([^<>()[\]\\.,;:\s@"]{2,})|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]{2,}\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase())
};
