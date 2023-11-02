import React, { useCallback, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { FakeText } from '@totalsoft/rocket-ui'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'
import WorkflowDAG from 'features/designer/diagram/WorkflowDAG'
import WorkflowGraph from 'features/designer/diagram/WorkflowGraph'
import Editor from '@monaco-editor/react'

const WorkflowJson = ({ loading, workflow, onChangeJson }) => {
  const { t } = useTranslation()
  const editorRef = useRef()
  const [decorations, setDecorations] = useState([])

  const handleOnClick = useCallback(
    node => {
      let editor = editorRef.current.getModel()
      let searchResult = editor.findMatches(`"taskReferenceName": "${node.ref.ref}"`)
      if (searchResult.length) {
        editorRef.current.revealLineInCenter(searchResult[0]?.range?.startLineNumber, 0)
        setDecorations(
          editorRef.current.deltaDecorations(decorations, [
            {
              range: searchResult[0]?.range,
              options: {
                isWholeLine: true
                //inlineClassName: classes.editorLineDecorator
              }
            }
          ])
        )
      }
    },
    [decorations]
  )

  const onchange = useCallback(
    v => {
      //debugger
      try {
        JSON.parse(v)
        onChangeJson(v)
      } catch {
        console.log('json not valid')
      }
    },
    [onChangeJson]
  )
  const dag = new WorkflowDAG(null, workflow)
  const formatJson = useCallback((editor, _monaco) => {
    editorRef.current = editor
    //setTimeout(() => editor.getAction('editor.action.formatDocument').run(), 100)
  }, [])

  if (loading) {
    return <FakeText lines={3} />
  }

  return (
    <>
      <div style={{ height: 100 }}></div>
      <Grid container>
        <Grid item xs={12} sm={12} lg={6}>
          <Editor
            height='100%'
            width='100%'
            theme='vs-light'
            language='json'
            autoIndent={true}
            options={{
              smoothScrolling: true,
              selectOnLineNumbers: true,
              minimap: {
                enabled: false
              }
            }}
            value={JSON.stringify(
              workflow,
              (key, value) => {
                if (key === '__typename' || key === 'startHandlers') return
                return value
              },
              '\t'
            )}
            onMount={formatJson}
            onChange={onchange}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={6}>
          <WorkflowGraph executionMode={false} dag={dag} t={t} onClick={handleOnClick} />
        </Grid>
      </Grid>
    </>
  )
}

WorkflowJson.propTypes = {
  loading: PropTypes.bool.isRequired,
  workflow: PropTypes.object,
  onChangeJson: PropTypes.func.isRequired
}

export default WorkflowJson
