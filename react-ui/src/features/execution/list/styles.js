import tableStyle from 'assets/jss/components/tableStyle'

const styles = theme => ({
  ...tableStyle(theme),
  table: {
    ...theme.table.main,
    lineHeight: '2em',
    marginTop: '0px'
  },
  tabLabel: {
    fontWeight: 'bold'
  },
  primaryText: {
    fontWeight: 'bold'
  },
  paper: {
    height: '100%',
    padding: '8px'
  },
  pre: {
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word'
  },
  wrapper: {
    height: "100%"
  },
  drawer: {
    zIndex: 999,
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: state => (state.isFullWidth ? "100%" : state.drawerWidth)
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: 10,
    justifyContent: "flex-end",
    height: 80,
    flexShrink: 0,
    boxShadow: "0 4px 8px 0 rgb(0 0 0 / 10%), 0 0 2px 0 rgb(0 0 0 / 10%)",
    zIndex: 1,
    backgroundColor: "#fff"
  },
  dragger: {
    display: state => (state.isFullWidth ? "none" : "block"),
    width: "5px",
    cursor: "ew-resize",
    padding: "4px 0 0",
    position: "absolute",
    height: "100%",
    zIndex: "100",
    backgroundColor: "#f4f7f9"
  },
  drawerMain: {
    paddingLeft: state => (state.isFullWidth ? 0 : 4),
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  drawerContent: {
    flex: "1 1 auto",
    overflowY: "scroll",
    backgroundColor: "#fff",
    position: "relative"
  },
  content: {
    overflowY: "scroll",
    height: "100%"
  },
  contentShift: {
    marginRight: state => state.drawerWidth
  },
  headerSubtitle: {
    marginBottom: 20
  },

  fr: {
    display: "flex",
    position: "relative",
    float: "right",
    marginRight: 50,
    marginTop: 10,
    zIndex: 1
  },
  frItem: {
    display: "flex",
    alignItems: "center",
    marginRight: 15
  }
})

export default styles
