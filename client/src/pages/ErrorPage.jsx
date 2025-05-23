import { React, useState, useEffect } from 'react'
import ContentBlock from '../components/ContentBlock'
import PageTitle from '../components/PageTitle'

function ErrorPage(props) {
    PageTitle(props.title)

    const Content = (
        <div>Access denied.</div>
    )

    return (
        <ContentBlock className="flex justify-center flex-wrap" valueBlock={Content}/>
    )
}

export default ErrorPage