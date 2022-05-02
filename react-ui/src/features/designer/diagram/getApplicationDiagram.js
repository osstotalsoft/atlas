import DiagramEngine from './DiagramEngine'
import nodes from '../nodeModels'

export const getApplicationDiagram = () => new DiagramEngine(nodes)
