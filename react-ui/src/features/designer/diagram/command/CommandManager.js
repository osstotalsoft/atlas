import Command from './Command'

export default class CommandManager {
  constructor() {
    this.clear()
  }

  clear() {
    this.stack = []
    this.index = 0
  }

  add({ redo, undo }) {
    const command = new Command(redo, undo)
    this.stack.length = this.index
    this.stack.push(command)
    this.index += 1
  }

  undo() {
    if (this.index > 0) {
      this.index -= 1
      const command = this.stack[this.index]
      command?.undo()
    }
  }

  redo() {
    if (this.index < this.stack.length) {
      const command = this.stack[this.index]
      command?.redo()
      this.index += 1
    }
  }
}
