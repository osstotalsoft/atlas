import { PointModel } from '@projectstorm/react-diagrams'
import { cloneSelection } from 'features/workflow/common/functions'

const commandHandlers = ({ engine }) => {
  const adjustLink = (link, nodes = []) => {
    const nodeList = [...Object.values(engine.getModel().getActiveNodeLayer().getModels()), ...nodes]

    let sourcePort = link.getSourcePort()
    if (sourcePort) {
      const node = nodeList.find(n => n.getID() === link.getSourcePort().getParent().getID())

      sourcePort = node.getPort(sourcePort.getName())

      link.setSourcePort(sourcePort)
      sourcePort.addLink(link)
    }

    let targetPort = link.getTargetPort()
    if (targetPort) {
      const node = nodeList.find(n => n.getID() === link.getTargetPort().getParent().getID())

      targetPort = node.getPort(targetPort.getName())

      link.setTargetPort(targetPort)
      targetPort.addLink(link)
    }

    return link
  }

  return {
    /**
     * Component added handler. Occurs when a component is added or
     * pasted.
     */
    nodesAdded: ({ nodes }) => {
      engine.commands.add({
        redo: () => {
          nodes.forEach(node => engine.getModel().addNode(node))
        },
        undo: () => {
          nodes.forEach(node => node.remove())
        }
      })
    },

    /**
     * Link added handler. Occurs on new links.
     */
    linkAdded: ({ link }) => {
      engine.commands.add({
        redo: () => {
          engine.getModel().addLink(adjustLink(link))
        },
        undo: () => {
          link.remove()
        }
      })
    },

    /**
     * Link changed handler. Occurs when a link is extended.
     */
    linkChanged: ({ before, after }) => {
      const handleLinkChanged = from => {
        const link = engine.getModel().getLink(from.id)

        // Update link points
        link?.setPoints(
          from.points.map(position => {
            const point = new PointModel({ link })
            point.setPosition(position)
            return point
          })
        )
      }

      engine.commands.add({
        redo: () => {
          handleLinkChanged(after)
        },
        undo: () => {
          handleLinkChanged(before)
        }
      })
    },

    selectionCloned: ({ itemsCloned }) => {
      engine.commands.add({
        redo: () => cloneSelection(engine, itemsCloned),
        undo: () => itemsCloned.map(item => item.remove())
      })
    },

    /**
     * Components and links removal handler.
     */
    entitiesRemoved: ({ nodes, links }) => {
      engine.commands.add({
        redo: () => {
          // Removes all nodes
          nodes.forEach(node => node.remove())

          // Removes all links
          links.forEach(link => link.remove())
        },
        undo: () => {
          /**
           * Adds all links in the correct order.
           */
          links.map(link => adjustLink(link, nodes)).forEach(link => engine.getModel().addLink(link))

          // Adds all nodes
          nodes.forEach(node => engine.getModel().addNode(node))
        }
      })
    },

    /**
     * Components and links move handler.
     */
    entitiesMoved: ({ nodes, links }) => {
      const handleEntitiesMoved = state => {
        // Updates all moved nodes position
        nodes[state].forEach(({ id, position }) => {
          const node = engine.getModel().getNode(id)
          node.setPosition(position.x, position.y)
        })

        // Updates all moved links points
        links[state].forEach(({ id, points }) => {
          const link = engine.getModel().getLink(id)
          link?.setPoints(
            points.map(position => {
              const point = new PointModel({ link })
              point.setPosition(position)
              return point
            })
          )
        })
      }

      engine.commands.add({
        redo: () => {
          handleEntitiesMoved('after')
        },
        undo: () => {
          handleEntitiesMoved('before')
        }
      })
    }
  }
}

export default commandHandlers
