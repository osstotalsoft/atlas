const forkNodeStyle = _theme => {
  const size = 80

  return {
    inPort: {
      position: 'absolute',
      zIndex: 10,
      left: 6,
      top: size / 2 - 10
    },
    outPort: {
      position: 'absolute',
      zIndex: 10,
      left: size - 10,
      top: size / 2 - 10
    },
    forkSvg: {
      width: size,
      height: size
    }
  }
}

export default forkNodeStyle
