import i18next from 'i18next'
import { isCNP as validateCnp } from '@totalsoft/validations'
import { Validator, Success, Failure, ValidationError } from '@totalsoft/pure-validations'
import { any } from 'ramda'
import moment from 'moment'

export const defaultFormatDateTime = date => moment(date).format('DD-MM-YYYY')

export function lessThanOrEqualDate(max) {
  return Validator(function lessThanOrEqualDate(value) {
    return value === null || value === undefined || moment(value).isSameOrBefore(max, 'day')
      ? Success
      : Failure(ValidationError(i18next.t('Validations.Generic.LessOrEqual', { max: max |> defaultFormatDateTime })))
  })
}

export function lessThanDate(max) {
  return Validator(function lessThanDate(value) {
    return value === null || value === undefined || moment(value).isBefore(max, 'day')
      ? Success
      : Failure(ValidationError(i18next.t('Validations.Generic.Less', { max: max |> defaultFormatDateTime })))
  })
}

export function greaterThanOrEqualDate(min) {
  return Validator(function greaterThanOrEqualDate(value) {
    return value === null || value === undefined || moment(value).isSameOrAfter(min, 'day')
      ? Success
      : Failure(ValidationError(i18next.t('Validations.Generic.GreaterOrEqual', { min: min |> defaultFormatDateTime })))
  })
}

export function greaterThanDate(min) {
  return Validator(function greaterThanDate(value) {
    return value === null || value === undefined || moment(value).isAfter(min, 'day')
      ? Success
      : Failure(ValidationError(i18next.t('Validations.Generic.Greater', { min: min |> defaultFormatDateTime })))
  })
}

export const isPhone = Validator(function isPhone(x) {
  const input = /^(07[2-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|)?([0-9]{3}(\s|\.|)){2}$/
  return input.test(String(x)) ? Success : Failure(ValidationError(i18next.t('Validations.Phone')))
})

export const noSpaceAtBeginning = Validator(function noSpaceAtBeginning(x) {
  const input = /^[^-\s]([a-zA-Z0-9])/
  return input.test(String(x)) ? Success : Failure(ValidationError(i18next.t('Validations.NoSpace')))
})

export const isCnp = Validator(function isCnp(x) {
  return validateCnp(x) ? Success : Failure(ValidationError(i18next.t('Validations.Cnp')))
})

export const isIdSeries = Validator(function isIdSeries(x) {
  var input = /^[A-Za-z]{2}$/
  return input.test(String(x)) ? Success : Failure(ValidationError(i18next.t('Validations.IdSeries')))
})

export const onlyLetters = Validator(function onlyLetters(x) {
  var input = /^[\p{Letter} -']+$/u
  return input.test(String(x)) ? Success : Failure(ValidationError(i18next.t('Validations.OnlyLetters')))
})

export const isSixNumberCharacters = Validator(function isSixNumberCharacters(x) {
  var input = /^[0-9]{6}$/
  return input.test(String(x)) ? Success : Failure(ValidationError(i18next.t('Validations.SixNumberCharacters')))
})

export const isPhotoUploaded = Validator(function isPhotoUploaded(input) {
  return input ? Success : Failure(ValidationError(i18next.t('Validations.IdPhotoMandatory')))
})

export const singleSelectionValidator = Validator(list => {
  if (list === null || list === undefined) {
    return Success
  }
  if (list.every(l => l.isMainActor === false)) {
    return Failure(ValidationError(i18next.t('Validations.TrueValueRequired')))
  } else if (list.filter(l => l.isMainActor === true).length > 1) {
    return Failure(ValidationError(i18next.t('Validations.SingleIsMainSelection')))
  } else {
    return Success
  }
})

export const requiredFile = Validator(x =>
  x && x.fileId && x.fileName ? Success : 'Validations.FileIsMandatory' |> i18next.t |> ValidationError |> Failure
)

export const integer = Validator(x => (Number.isInteger(x) ? Success : 'Validations.Integer' |> i18next.t |> ValidationError |> Failure))

export const numberOfFiles = Validator(list =>
  list.length > 5 ? Failure(ValidationError(i18next.t('Validations.MaximumNumberOfFiles'))) : Success
)

export const isCnpUnique = (list, personId) =>
  Validator(function isCnpUnique(cnp) {
    return list |> any(item => item.cnp === cnp && item.id !== personId)
      ? Failure(ValidationError(i18next.t('Validations.UniqueCnp')))
      : Success
  })

export const isNameUnique = list =>
  Validator(function isNameUnique(name) {
    if (!list) return Success
    return list |> any(item => item.name === name) ? Failure(ValidationError(i18next.t('Validations.UniqueName'))) : Success
  })

export const isNameUniqueNoId = (list, ownName) =>
  Validator(function isNameUnique(name) {
    return (ownName === name ? false : list |> any(item => item.name === name))
      ? Failure(ValidationError(i18next.t('Validations.UniqueName')))
      : Success
  })

export const isNamedNew = Validator(function isNamedNew(name) {
  return name === 'new' ? Failure(ValidationError(i18next.t('Validations.NameCannotBeNew'))) : Success
})
