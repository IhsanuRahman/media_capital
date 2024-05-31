import { image } from '@uiw/react-markdown-editor'
import React from 'react'
import { baseUrl } from '../../constants'

function GridPosts({posts}) {
  return (
    <div className='row clearfix  justify-content-center mt-2'>
      {posts.map((post,id)=>
        <img src={baseUrl + post.image} className='col' style={{maxHeight:'300px',maxWidth:'250px'}}/>
      )}
    </div>
  )
}

export default GridPosts
