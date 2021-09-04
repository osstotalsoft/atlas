const joinNodeStyle = _theme => {
  const size = 80

  return {
    inPort: {
      position: 'absolute',
      zIndex: 10,
      left: 7,
      top: size / 2 - 10
    },
    outPort: {
      position: 'absolute',
      zIndex: 10,
      left: size - 11,
      top: size / 2 - 10
    },
    joinSvg: {
      width: size,
      height: size
    }
  }
}

export default joinNodeStyle
