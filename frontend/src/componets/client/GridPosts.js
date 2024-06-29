import { image } from '@uiw/react-markdown-editor'
import React from 'react'
import { baseUrl } from '../../constants'
import { useNavigate } from 'react-router-dom'

function GridPosts({posts}) {
  const navigator=useNavigate()
  return (
    <div className='row gap-2  clearfix  justify-content-center mt-2'>
       
      {posts?.length==0? <div className='d-flex w-100'>
                <h1 className='text-secondary m-auto'>
                    no posts</h1></div>:posts.map((post,idx)=>
        <img key={idx} src={baseUrl + post.image} className='col zoom' style={{maxHeight:'300px',maxWidth:'250px'}} 
        onClick={e => {
          navigator('/post/' + post.id)
      }}
        />
      )}
    </div>
  )
}

export default GridPosts
