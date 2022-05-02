export default class Command {
  constructor(redo, undo) {
    this.redo = redo
    this.undo = undo
  }

  redo(engine) {
    this.redo(engine)
  }

  undo(engine) {
    this.undo(engine)
  }
}
