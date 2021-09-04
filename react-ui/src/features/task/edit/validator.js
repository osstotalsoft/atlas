import * as V from '@totalsoft/pure-validations'
import { isNamedNew, isNameUniqueNoId } from 'utils/simple-validations/validations'

export const buildValidator = (taskList, ownName) =>
  V.fromModel(() =>
    V.shape({
      name: [V.required, isNamedNew, isNameUniqueNoId(taskList, ownName)] |> V.stopOnFirstFailure
    })
  )
