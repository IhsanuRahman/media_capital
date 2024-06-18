import React, { useEffect, useRef, useState } from 'react'
import api from '../../../axios';
import PostItem from '../../../componets/client/PostItem';

function Recommended() {
    const [posts, setPosts] = useState([])
    const listInnerRef = useRef();
    const [currPage, setCurrPage] = useState(1); 
    const [prevPage, setPrevPage] = useState(0);
    const [wasLastList, setWasLastList] = useState(false);
    const [isLoading, setLoading] = useState(false)
    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await api.get('/posts/recommended', {
                params: {
                    page: currPage,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,

                },

            })
            // .then(e => {
            //     console.log(e.data.posts);
            //     setPosts(e.data.posts)
            // })
            if (!response.data.posts.length || response.data.posts.length === 0) {
                setWasLastList(true);
                setLoading(false)
                return;
            }
            setPrevPage(currPage);
            setPosts([...posts, ...response.data.posts]);
            setCurrPage(currPage + 1)
            setLoading(false)
        }catch{
            console.log('error');
        }
    }
    const onScroll = () => {
        if (listInnerRef.current) {
            const { scrollTop, scrollHeight, offsetHeight } = listInnerRef.current;
            console.log(scrollTop + offsetHeight, scrollHeight, offsetHeight)
            if ((scrollTop + offsetHeight) >= scrollHeight && !wasLastList) {
                fetchData()
            }
        }
    };
    useEffect(() => {

        if (!wasLastList && prevPage !== currPage) {
            fetchData();
        }

    }, [])
  return (
    <div ref={listInnerRef} onScroll={onScroll} className='w-100 reponsive-border flex-column gap-2  d-flex overflow-y-scroll align-items-center hidescroller pt-2 ' style={{ maxHeight: 'calc(100% - 95px)' }}  >

            {posts.map((post, idx) => {
                return <PostItem id={idx} post={post} />
            })}
            {isLoading && <div className='ps-auto pe-auto'>
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>}
        </div>
  )
}

export default Recommended