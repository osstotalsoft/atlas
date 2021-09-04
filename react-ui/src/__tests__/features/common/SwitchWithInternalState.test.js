import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import SwitchWithInternalState from 'features/common/components/SwitchWithInternalState'
import renderer from 'react-test-renderer'

describe('Switch with internal state should work as expected', () => {
  it('Should render correctly', () => {
    const onClickMock = jest.fn()

    const tree = renderer.create(<SwitchWithInternalState checked={true} onChange={onClickMock} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('Should render with no errors', () => {
    const onClickMock = jest.fn()

    const component = render(<SwitchWithInternalState checked={true} onChange={onClickMock} />)
    expect(component).toBeDefined()
  })

  it('Should display only the off label (TestOff)', () => {
    const onClickMock = jest.fn()

    const { queryByText } = render(
      <SwitchWithInternalState checked={false} onChange={onClickMock} labelOff={'TestOff'} labelOn={'TestOn'} />
    )
    expect(queryByText('TestOff')).toBeInTheDocument()
    expect(queryByText('TestOn')).not.toBeInTheDocument()
  })

  it('Should call onChange once for one click hit', () => {
    const onClickMock = jest.fn()
    const { getByRole } = render(
      <SwitchWithInternalState checked={false} onChange={onClickMock} labelOff={'TestOff'} labelOn={'TestOn'}></SwitchWithInternalState>
    )

    const toggle = getByRole('checkbox')
    fireEvent.click(toggle)
    expect(onClickMock).toHaveBeenCalledTimes(1)
  })

  it('Should be secondary color when true .MuiSwitch-colorSecondary.Mui-checked', () => {
    const onClickMock = jest.fn()
    render(
      <SwitchWithInternalState checked={false} onChange={onClickMock} labelOff={'TestOff'} labelOn={'TestOn'}></SwitchWithInternalState>
    )
    const toggle = screen.getByRole('checkbox')
    fireEvent.click(toggle)
    const toggleOn = screen.getByRole('checkbox')
    //expect(toggleOn).toHaveClass('.MuiSwitch-colorSecondary.Mui-checked') TODO
  })
})
