import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import PostItem from './PostItem';
function Posts({ posts }) {
   
    return (

        <div className='w-100 reponsive-border flex-column gap-2  d-flex align-items-center pt-2 overflow-y-scroll hidescroller' style={{ maxHeight: (window.innerHeight - 150) + 'px', }}>
            {posts.map((post, idx) => {
                return <PostItem id={idx} post={post} />
            })} 
        </div>
    )
}

export default Posts
