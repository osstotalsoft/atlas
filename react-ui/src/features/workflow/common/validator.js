import { areNameAndVersionUnique, isNamedNew } from 'utils/simple-validations/validations'
import {
  Validator,
  Success,
  Failure,
  ValidationError,
  required,
  stopOnFirstFailure,
  fromModel,
  shape,
  fromRoot,
  when
} from '@totalsoft/pure-validations'
import { any } from 'ramda'
import i18next from 'i18next'

const isTaskReferenceNameUniqueNoId = (list, ownName) =>
  Validator(function nameIsUnique(name) {
    return (ownName === name ? false : list |> any(item => item.taskReferenceName === name))
      ? Failure(ValidationError(i18next.t('Validations.UniqueName')))
      : Success
  })

export const buildValidator = workflowList => {
  return [required, areNameAndVersionUnique(workflowList), isNamedNew] |> stopOnFirstFailure
}

export const buildWfTaskValidator = (taskList, ownName) =>
  fromModel(() =>
    shape({
      inputs: shape({
        name: required,
        taskReferenceName: [isTaskReferenceNameUniqueNoId(taskList, ownName), required] |> stopOnFirstFailure,
        asyncHandler: fromRoot(root => required |> when(root.asyncComplete))
      })
    })
  )
