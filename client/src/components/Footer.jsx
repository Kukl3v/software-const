import { React, useState } from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className='w-full bg-white border-t border-gray-200 py-4 px-6 flex justify-end'>
            <Link to="https://github.com/Kukl3v" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-600 hover:underline">@Kukl3v</Link>
        </footer>
    )
}

export default Footer