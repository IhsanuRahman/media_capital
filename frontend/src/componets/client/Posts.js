import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import PostItem from './PostItem';
function Posts({ posts }) {
    const ref = useRef()
   
    return (

        <div ref={ref} className='w-100 reponsive-border flex-column gap-2  d-flex overflow-y-scroll align-items-center hidescroller pt-2' style={{ maxHeight: (window.innerHeight - 150) + 'px', }}>
            {posts.map((post, idx) => {
                return <PostItem id={idx} post={post}/>
            })}
        </div>
    )
}

export default Posts
