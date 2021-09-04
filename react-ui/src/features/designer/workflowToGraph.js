import clone from 'lodash/fp/clone'
import { keys } from 'ramda'
import { nodeConfig } from './constants/NodeConfig'

class Workflow2Graph {
  edges: []
  vertices: []

  convert(wfe, meta) {
    this._convert(wfe, meta)
    return { edges: this.edges, vertices: this.vertices, id: wfe.workflowId }
  }
  _convert(wfe, meta) {
    const subWorkflows = {}
    const metaTasks = (meta.tasks && clone(meta.tasks)) || []
    metaTasks.push({
      type: 'END',
      name: 'END',
      label: '',
      taskReferenceName: 'END',
      system: true
    })
    metaTasks.unshift({
      type: 'START',
      name: 'START',
      label: '',
      taskReferenceName: 'START',
      system: true
    })

    const forks = []
    const tasks = wfe.tasks || []
    tasks.forEach(tt => {
      if (tt.taskType === 'FORK') {
        let wfts = []
        let forkedTasks = (tt.inputData && tt.inputData.forkedTasks) || []
        forkedTasks.forEach(ft => {
          wfts.push({ name: ft, referenceTaskName: ft, type: 'SIMPLE' })
        })
        forks[tt.referenceTaskName] = wfts
      }
    })

    let nodes = []
    let vertices = {}

    this.executedTasks = {}
    let joins = {}
    if (keys(wfe).length) {
      wfe.tasks.forEach(t => {
        this.executedTasks[t.referenceTaskName] = {
          status: t.status,
          input: t.inputData,
          output: t.outputData,
          taskType: t.taskType,
          reasonForIncompletion: t.reasonForIncompletion,
          task: t
        }
        if (t.taskType === 'JOIN') {
          joins[t.referenceTaskName] = t.inputData.joinOn
        }
      })
    }

    this.executedTasks['END'] = {
      status: 'FINALIZED',
      input: '',
      output: wfe.output,
      taskType: 'END',
      reasonForIncompletion: wfe.reasonForIncompletion,
      task: {}
    }
    this.executedTasks['START'] = {
      status: 'STARTED',
      input: wfe.input,
      output: '',
      taskType: 'END',
      reasonForIncompletion: '',
      task: {}
    }
    this.getTaskNodes(vertices, nodes, metaTasks, forks, subWorkflows, true)

    this.edges = nodes
    this.vertices = vertices
    this.vertices['END'] = {
      name: 'END',
      ref: 'END',
      type: 'END',
      style: 'fill:#ffffff',
      shape: 'circle',
      system: true
    }
    this.vertices['START'] = {
      name: 'START',
      ref: 'START',
      type: 'START',
      style: 'fill:#ffffff',
      shape: 'circle',
      system: true
    }

    for (let v in this.vertices) {
      let et = this.executedTasks[v]
      let status = et ? et.status : ''

      let style = ''
      let labelStyle = ''
      switch (status) {
        case 'FAILED':
        case 'TIMED_OUT':
        case 'CANCELLED':
        case 'CANCELED':
        case 'FAILED_WITH_TERMINAL_ERROR':
          style = 'stroke: #ff0000; fill: #ff0000'
          labelStyle = 'fill:#ffffff; stroke-width: 1px'
          break
        case 'IN_PROGRESS':
        case 'SCHEDULED':
          style = 'stroke: orange; fill: orange'
          labelStyle = 'fill:#ffffff; stroke-width: 1px'
          break
        case 'COMPLETED':
          style = 'stroke: #48a770; fill: #48a770'
          labelStyle = 'fill:#ffffff; stroke-width: 1px'
          break
        case 'COMPLETED_WITH_ERRORS':
          style = 'stroke: #FF8C00; fill: #FF8C00'
          labelStyle = 'fill:#ffffff; stroke-width: 1px'
          break
        case 'SKIPPED':
          style = 'stroke: #cccccc; fill: #ccc'
          labelStyle = 'fill:#ffffff; stroke-width: 1px'
          break
        case 'FINALIZED':
        case 'STARTED':
          style = 'stroke: #000000; fill: #FFFFFF'
          labelStyle = 'fill:#000000; stroke-width: 1px'
          break
        default:
          break
      }
      if (status !== '') {
        this.vertices[v].style = style
        this.vertices[v].labelStyle = labelStyle
        let tooltip =
          '<p><strong>Input</strong></p>' +
          JSON.stringify(et.input, null, 2) +
          '<p/><p><strong>Output</strong></p>' +
          JSON.stringify(et.output, null, 2)
        tooltip += '<p/><p><strong>Status</strong> : ' + et.status + '</p>'
        if (status === 'FAILED') {
          tooltip += '<p><strong>Failure Reason</strong></p><p/' + et.reasonForIncompletion + '>'
        }
        this.vertices[v].data = et
        this.vertices[v].tooltip = tooltip
        this.vertices[v].tooltipTitle = et.taskType + ' - ' + et.status
      }
    }
  }

  getTaskNodes(vertices, nodes, tasks, forks, subworkflows, isExecutingCase) {
    if (tasks == null || tasks.length == null) {
      return nodes
    }
    for (let i = 1; i < tasks.length; i++) {
      this.getNodes(vertices, nodes, tasks[i - 1], tasks[i], forks, subworkflows, isExecutingCase)
    }
    return nodes
  }

  getNodes(vertices, nodes, t1, t2, forks, subworkflows, isExecutingCase) {
    let executed = 'stroke: #000000; fill: transparent'
    let defstyle = 'stroke: #ccc; fill: transparent; stroke-dasharray: 5, 5'
    let isExecuting = isExecutingCase
    if (t1.type === 'END' && t1.type === t2.type) {
      vertices[t1.taskReferenceName] = {
        name: t1.name,
        ref: t1.taskReferenceName,
        type: 'simple',
        style: 'fill:#ffffff',
        shape: 'circle',
        system: true
      }
      return nodes
    }

    if (t1.type === 'FORK_JOIN') {
      vertices[t1.taskReferenceName] = {
        name: 'FORK',
        ref: t1.taskReferenceName,
        type: 'simple',
        style: 'fill: #ff0',
        shape: 'house',
        system: true
      }

      let fork = t1.forkTasks || []
      fork.forEach(ft => {
        let tasks = ft

        vertices[tasks[0].taskReferenceName] = {
          name: tasks[0].name,
          ref: tasks[0].taskReferenceName,
          type: tasks[0].type,
          style: '',
          shape: 'rect'
        }

        let style = defstyle
        if (this.executedTasks[tasks[0].taskReferenceName] != null && this.executedTasks[t1.taskReferenceName] != null) {
          style = executed
        } else {
          isExecuting = false
        }

        nodes.push({
          type: 'FORK_JOIN',
          from: t1.taskReferenceName,
          to: tasks[0].taskReferenceName,
          label: '',
          style: style
        })

        this.getTaskNodes(vertices, nodes, tasks, forks, subworkflows)
        this.getNodes(vertices, nodes, tasks[tasks.length - 1], t2, forks, subworkflows)
      })
    } else if (t1.type === 'DO_WHILE') {
      let tasks = t1.loopOver || []
      let t1End = { ...t1 }
      t1End.taskReferenceName = t1.taskReferenceName + '_end'

      vertices[t1.taskReferenceName] = {
        name: t1.name,
        ref: t1.taskReferenceName,
        type: 'simple',
        style: 'fill: #ff0',
        shape: 'house',
        system: true
      }
      vertices[tasks[0].taskReferenceName] = {
        name: tasks[0].name,
        ref: tasks[0].taskReferenceName,
        type: tasks[0].type,
        style: '',
        shape: 'rect'
      }

      let style = defstyle
      if (this.executedTasks[tasks[0].taskReferenceName] != null && this.executedTasks[t1.taskReferenceName] != null) {
        style = executed
        //caseExecuted = true;
      }

      nodes.push({
        type: 'simple',
        from: t1.taskReferenceName,
        to: tasks[0].taskReferenceName,
        style: style
      })
      this.getTaskNodes(vertices, nodes, tasks, forks, subworkflows, isExecuting)
      vertices[t1End.taskReferenceName] = {
        name: 'DO_WHILE_END',
        ref: t1End.taskReferenceName,
        type: 'simple',
        style: 'fill: #ff0',
        shape: 'ellipse',
        system: true
      }

      this.getNodes(vertices, nodes, tasks[tasks.length - 1], t1End, forks, subworkflows, isExecuting)

      nodes.push({
        type: 'simple',
        to: t2.taskReferenceName,
        from: t1End.taskReferenceName,
        style: style
      })
    } else if (t1.type === nodeConfig.FORK_JOIN_DYNAMIC.type) {
      vertices[t1.taskReferenceName] = {
        name: 'DYNAMIC_FORK',
        ref: t1.taskReferenceName,
        style: 'fill: #ff0',
        shape: 'house',
        system: true
      }
      let style = defstyle
      if (this.executedTasks[t2.taskReferenceName] != null && this.executedTasks[t1.taskReferenceName] != null) {
        style = executed
      } else {
        isExecuting = false
      }
      const fts = forks[t1.taskReferenceName] || []
      fts.forEach(ft => {
        vertices[ft.referenceTaskName] = {
          name: ft.name,
          ref: ft.referenceTaskName,
          type: 'simple',
          style: 'fill: #ff0',
          shape: 'rect'
        }
        nodes.push({
          type: 'simple',
          from: t1.taskReferenceName,
          to: ft.referenceTaskName,
          label: '',
          style: style
        })
        nodes.push({
          type: 'simple',
          from: ft.referenceTaskName,
          to: t2.taskReferenceName,
          label: '',
          style: style
        })
      })
      if (fts.length === 0) {
        nodes.push({
          type: 'simple',
          from: t1.taskReferenceName,
          to: t2.taskReferenceName,
          label: '',
          style: style
        })
      }
    } else if (t1.type === nodeConfig.DECISION.type) {
      //let caseExecuted = false
      for (let k in t1.decisionCases) {
        const tasks = t1.decisionCases[k]

        vertices[t1.taskReferenceName] = {
          name: t1.name,
          ref: t1.taskReferenceName,
          type: t1.type,
          style: 'fill: #ff0',
          shape: 'diamond',
          system: true
        }
        tasks.forEach(t => {
          vertices[t.taskReferenceName] = {
            name: t.name,
            ref: t.taskReferenceName,
            type: t.type,
            style: '',
            shape: 'rect'
          }
        })

        let style = defstyle
        if (this.executedTasks[tasks[0].taskReferenceName] != null && this.executedTasks[t1.taskReferenceName] != null) {
          style = executed
          //caseExecuted = true
        }

        nodes.push({
          type: nodeConfig.DECISION.type,
          from: t1.taskReferenceName,
          to: tasks[0].taskReferenceName,
          label: k,
          style: style
        })
        this.getTaskNodes(vertices, nodes, tasks, forks, subworkflows, isExecuting)
        this.getNodes(vertices, nodes, tasks[tasks.length - 1], t2, forks, subworkflows, isExecuting)
      }

      let tasks = t1.defaultCase
      if (tasks == null) tasks = []
      if (tasks.length > 0) {
        vertices[t1.taskReferenceName] = {
          name: t1.name,
          ref: t1.taskReferenceName,
          type: t1.type,
          style: 'fill: #ff0',
          shape: 'diamond',
          system: true
        }
        vertices[tasks[0].taskReferenceName] = {
          name: tasks[0].name,
          ref: tasks[0].taskReferenceName,
          type: tasks[0].type,
          style: '',
          shape: 'rect'
        }

        let style = defstyle
        if (this.executedTasks[tasks[0].taskReferenceName] != null && this.executedTasks[t1.taskReferenceName] != null) {
          style = executed
        }

        nodes.push({
          type: nodeConfig.DECISION.type,
          from: t1.taskReferenceName,
          to: tasks[0].taskReferenceName,
          label: 'default',
          style: style
        })
        this.getTaskNodes(vertices, nodes, tasks, forks, subworkflows, isExecuting)
        this.getNodes(vertices, nodes, tasks[tasks.length - 1], t2, forks, subworkflows, isExecuting)
      }
      //the default case: not implemented in Atlas
      //  else {
      //   nodes.push({
      //     type: 'decision',
      //     from: t1.taskReferenceName,
      //     to: t2.taskReferenceName,
      //     label: '',
      //     style: !caseExecuted && isExecuting ? executed : defstyle
      //   })
      // }
    } else if (t1.type === 'JOIN') {
      vertices[t1.taskReferenceName] = {
        name: t1.name,
        ref: t1.taskReferenceName,
        type: 'simple',
        style: 'fill:#ff0',
        shape: 'ellipse',
        system: true
      }

      let style = defstyle
      if (this.executedTasks[t2.taskReferenceName] != null && this.executedTasks[t1.taskReferenceName] != null) {
        style = executed
      } else {
        isExecuting = false
      }
      nodes.push({
        type: 'simple',
        from: t1.taskReferenceName,
        to: t2.taskReferenceName,
        label: '',
        style: style
      })
    } else if (t1.type === 'EVENT') {
      vertices[t1.taskReferenceName] = {
        name: t1.name,
        ref: t1.taskReferenceName,
        type: 'simple',
        style: 'fill:#ff0',
        shape: 'star',
        system: true
      }

      let style = defstyle
      if (this.executedTasks[t2.taskReferenceName] != null && this.executedTasks[t1.taskReferenceName] != null) {
        style = executed
      } else {
        isExecuting = false
      }
      nodes.push({
        type: 'simple',
        from: t1.taskReferenceName,
        to: t2.taskReferenceName,
        label: '',
        style: style
      })
    } else if (t1.type === 'SUB_WORKFLOW') {
      vertices[t1.taskReferenceName] = {
        name: t1.name,
        ref: t1.taskReferenceName,
        type: 'simple',
        style: 'fill:#efefef',
        shape: 'rect',
        system: true
      }

      let style = defstyle
      if (this.executedTasks[t2.taskReferenceName] != null && this.executedTasks[t1.taskReferenceName] != null) {
        style = executed
      } else {
        isExecuting = false
      }
      nodes.push({
        type: 'simple',
        from: t1.taskReferenceName,
        to: t2.taskReferenceName,
        label: '',
        style: style
      })
    } else if (t1.type === 'EXCLUSIVE_JOIN') {
      vertices[t1.taskReferenceName] = {
        name: t1.name,
        ref: t1.taskReferenceName,
        type: 'simple',
        style: 'fill:#ff0',
        shape: 'star',
        system: true
      }

      let style = defstyle
      if (this.executedTasks[t2.taskReferenceName] != null && this.executedTasks[t1.taskReferenceName] != null) {
        style = executed
      } else {
        isExecuting = false
      }
      nodes.push({
        type: 'simple',
        from: t1.taskReferenceName,
        to: t2.taskReferenceName,
        label: '',
        style: style
      })
    } else {
      vertices[t1.taskReferenceName] = {
        name: t1.name,
        ref: t1.taskReferenceName,
        type: 'simple',
        style: 'fill:#ff0',
        shape: 'rect'
      }

      let style = defstyle
      if (this.executedTasks[t2.taskReferenceName] != null && this.executedTasks[t1.taskReferenceName] != null) {
        style = executed
      } else {
        isExecuting = false
      }
      nodes.push({
        type: 'simple',
        from: t1.taskReferenceName,
        to: t2.taskReferenceName,
        label: '',
        style: style
      })
    }
    return nodes
  }
}

export default Workflow2Graph
