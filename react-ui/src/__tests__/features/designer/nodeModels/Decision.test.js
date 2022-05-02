import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import SwitchParameterOrExpression from 'features/designer/nodeModels/decisionNode/SwitchParameterOrExpression'
import createEngine, { DiagramModel } from '@projectstorm/react-diagrams'
import DecisionNodeModel from 'features/designer/nodeModels/decisionNode/DecisionNodeModel'
import LambdaNodeModel from 'features/designer/nodeModels/lambdaNode/LambdaNodeModel'
import EventNodeModel from 'features/designer/nodeModels/eventNode/EventNodeModel'
import HttpNodeModel from 'features/designer/nodeModels/httpNode/HttpNodeModel'
import { errorMessages } from 'features/designer/constants/ErrorMessages'
import TerminateNodeModel from 'features/designer/nodeModels/terminateNode/TerminateNodeModel'

describe('Decision task settings should be properly set', () => {
  it('When switching to expression, should not have caseValueParam defined and should keep caseExpression', () => {
    let obj = { decisionCases: { a: [], b: [] }, caseValueParam: 'param', caseExpression: 'if (true) return a;' }
    const mockedLens = {
      __target: {
        state: { ...obj },
        setState: newVal => {
          obj = newVal
        }
      }
    }

    let toggle = false
    const mockSetToggle = jest.fn(newVal => (toggle = newVal))

    render(<SwitchParameterOrExpression toggle={toggle} setToggle={mockSetToggle} inputsLens={mockedLens} />)

    const switchComponent = screen.getByRole('checkbox')
    fireEvent.click(switchComponent)

    expect(obj.caseValueParam).toBeUndefined()
    expect(obj.caseExpression).not.toBeUndefined()
  })

  it('When switching to valueParam, should not have caseExpression defined and should keep caseValueParam', () => {
    let obj = { decisionCases: [{ a: 1 }, { b: 2 }], caseExpression: 'if (true) return a;', caseValueParam: 'param' }
    const mockedLens = {
      __target: {
        state: { ...obj },
        setState: newVal => {
          obj = newVal
        }
      }
    }

    let toggle = true
    const mockSetToggle = jest.fn(newVal => (toggle = newVal))

    render(<SwitchParameterOrExpression toggle={toggle} setToggle={mockSetToggle} inputsLens={mockedLens} />)

    const switchComponent = screen.getByRole('checkbox')
    fireEvent.click(switchComponent)

    expect(obj.caseExpression).toBeUndefined()
    expect(obj.caseValueParam).not.toBeUndefined()
  })

  it('Should validate if the node has all ports connected with the corresponding number of links', () => {
    const engine = createEngine()
    const model = new DiagramModel()
    engine.setModel(model)

    const decision = new DecisionNodeModel()
    const decision_in = decision.addInPort('in')

    const lambda = new LambdaNodeModel()
    const lambda_out = lambda.addOutPort('out')

    const event = new EventNodeModel()
    const event_in = event.addInPort('in')

    const http = new HttpNodeModel()
    const http_in = http.addInPort('in')

    const terminate = new TerminateNodeModel()
    const terminate_in = terminate.addInPort('in')

    //no decision cases defined
    model.addAll(lambda, decision, event, http)
    expect(decision.validate()[1]).toContain(errorMessages.atLeastOneCase)

    const decision_out1 = decision.addOutPort('case1')
    const decision_out2 = decision.addOutPort('case2')

    //input port is not connected
    model.addAll(lambda, decision, event, http)
    expect(decision.validate()[1]).toContain(errorMessages.notLinked)

    const link1 = lambda_out.link(decision_in)
    const link2 = decision_out1.link(event_in)

    //case2 is not connected
    model.addAll(lambda, decision, event, http, link1, link2)
    expect(decision.validate()[1]).toContain(errorMessages.notLinked)

    const link3 = decision_out2.link(http_in)

    //linked correctly
    model.addAll(link3)
    expect(decision.validate()[0]).toBe(true)

    const link4 = decision_out2.link(terminate_in)

    //case2 is linked to twice
    model.addAll(link4)
    expect(decision.validate()[1]).toContain(errorMessages.caseMultipleLinks)
  })
})
