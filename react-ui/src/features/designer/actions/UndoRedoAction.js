import { Action, InputType } from '@projectstorm/react-canvas-core'

export default class UndoRedoAction extends Action {
  constructor() {
    super({
      type: InputType.KEY_DOWN,
      fire: ({ event }) => {
        if (this.matchesInput(event)) {
          event.preventDefault()

          const { ctrlKey, code } = event
          if (ctrlKey && code === 'KeyZ') this.handleUndo()
          else if (ctrlKey && code === 'KeyY') this.handleRedo()
        }
      }
    })
  }

  matchesInput = ({ ctrlKey, shiftKey, code }) =>
    (ctrlKey && (code === 'KeyZ' || code === 'KeyY')) || (ctrlKey && shiftKey && code === 'KeyZ')

  handleUndo = () => {
    this.engine.commands.undo()
    this.engine.repaintCanvas()
  }

  handleRedo = () => {
    this.engine.commands.redo()
    this.engine.repaintCanvas()
  }
}
