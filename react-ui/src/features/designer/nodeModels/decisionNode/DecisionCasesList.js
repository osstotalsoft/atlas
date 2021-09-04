import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import DecisionCaseItem from './DecisionCaseItem'
import { get, over, set } from '@totalsoft/rules-algebra-react'
import { emptyObject } from 'utils/constants'
import { dissoc, keys } from 'ramda'
import { objectReplaceKey } from 'utils/functions'

const DecisionCasesList = ({ casesLens }) => {
  const cases = casesLens |> get
  const properties = keys(cases || emptyObject)

  const handleRemoveItem = useCallback(
    value => () => {
      over(casesLens, dissoc(value))
    },
    [casesLens]
  )

  const handleCaseChange = useCallback(
    (oldKey, newKey) => {
      const oldObject = cases
      let newObject = objectReplaceKey(oldObject, oldKey, newKey)
      set(casesLens, newObject)
    },
    [cases, casesLens]
  )

  return (
    <>
      {properties?.map((caseItem, index) => (
        <DecisionCaseItem key={index} caseItem={caseItem} index={index} onChange={handleCaseChange} onRemove={handleRemoveItem(caseItem)} />
      ))}
    </>
  )
}

DecisionCasesList.propTypes = {
  casesLens: PropTypes.object.isRequired
}

export default DecisionCasesList
