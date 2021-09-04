const infiniteScrollStyle = () => ({
  container: {
    overflow: 'scroll',
    height: 'calc(100% - 200px)'
  },
  paddingBottom: {
    height: '300px'
  },
  child: {
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'stretch',
    margin: '8px 0px'
  }
})

export default infiniteScrollStyle
