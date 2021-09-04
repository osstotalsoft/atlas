import * as V from '@totalsoft/pure-validations'
import { Validator, Success, Failure, ValidationError } from '@totalsoft/pure-validations'
import i18next from 'i18next'
import { isNameUniqueNoId } from 'utils/simple-validations/validations'

const isValidSink = Validator(function isValidSink(x) {
  const input = /(conductor|nats_stream):[a-zA-Z0-9-._]/
  return input.test(String(x)) ? Success : Failure(ValidationError(i18next.t('Validations.InvalidSink')))
})

export const buildValidator = (handlerList, ownName) =>
  V.fromModel(() =>
    V.shape({
      name: [V.required, isNameUniqueNoId(handlerList, ownName)] |> V.stopOnFirstFailure,
      event: [V.required, isValidSink] |> V.stopOnFirstFailure,
      actions:
        [
          V.atLeastOne,
          V.items(
            V.shape({
              action: V.required
            })
          )
        ] |> V.stopOnFirstFailure
    })
  )
