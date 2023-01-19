import * as V from '@totalsoft/pure-validations'
import { Validator, Success, Failure, ValidationError } from '@totalsoft/pure-validations'
import i18next from 'i18next'
import { isNameUniqueNoId } from 'utils/simple-validations/validations'

export const buildValidator = (list, ownName) =>
  V.fromModel(() =>
    V.shape({
      name: [V.required, isNameUniqueNoId(list, ownName)] |> V.stopOnFirstFailure,
      workflowContext: [V.required, isValidJson] |> V.stopOnFirstFailure
    })
  )

const isValidJson = Validator(function isJson(string) {
  try {
    JSON.parse(string)
    return Success
  } catch {
    return Failure(ValidationError(i18next.t('Validations.WorkflowContext')))
  }
})
