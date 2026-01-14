'use client'

import { Tldraw, useEditor } from 'tldraw'
import 'tldraw/tldraw.css'

const Home = () => {
  return (
    <div className='p-6 h-screen'>
      <Tldraw licenseKey={process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY}
        onMount={(editor) => {
          // Access the editor instance here
          console.log('Editor mounted:', editor)
        }}
      />
    </div>
  )
}

export default Home