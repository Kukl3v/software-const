import { useLayoutEffect } from 'react'
import { APP_NAME } from '../config/Constants';

function PageTitle(title) {
  useLayoutEffect(() => {
    document.title = `${title} | ${APP_NAME}`
  }, [title])
}

export default PageTitle
