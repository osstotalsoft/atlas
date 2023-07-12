import { env } from './env'
import { defaultTheme, greenTheme, blueTheme, orangeTheme, redTheme, vividOrangeTheme, lightBlueTheme } from '@totalsoft/rocket-ui'

const getTheme = () => {
  const subDomain = env.REACT_APP_THEME
  switch (subDomain) {
    case 'green':
      return greenTheme
    case 'blue':
      return blueTheme
    case 'orange':
      return orangeTheme
    case 'red':
      return redTheme
    case 'vividOrange':
      return vividOrangeTheme
    case 'lightBlue':
      return lightBlueTheme
    default:
      return defaultTheme
  }
}

export const theme = getTheme()
export const logo = theme.logo
