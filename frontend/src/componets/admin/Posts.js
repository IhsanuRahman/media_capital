import React, { Suspense, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import api from '../../axios';
import PostItem from '../admin/PostItem';
import Search from '../../pages/client/home/Search';

function Posts() {
    const [tab, setTab] = useState(0)
    const { isAuthenticated, user, loading } = useSelector(state => state.user);
    const [posts, setPosts] = useState([])
    const listInnerRef = useRef();
    const [currPage, setCurrPage] = useState(1);
    const [prevPage, setPrevPage] = useState(0);
    const [wasLastList, setWasLastList] = useState(false);
    const [isLoading, setLoading] = useState(false)
    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await api.get('/posts', {
                params: {
                    page: currPage,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,

                },

            })
            if (!response.data.posts.length || response.data.posts.length === 0) {
                setWasLastList(true);
                setLoading(false)
                return;
            }
            setPrevPage(currPage);
            setPosts([...posts, ...response.data.posts]);
            setCurrPage(currPage + 1)
            setLoading(false)
        } catch {
            console.log('error');
        }
    }
    const onScroll = () => {
        if (listInnerRef.current) {
            const { scrollTop, scrollHeight, offsetHeight } = listInnerRef.current;
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

        Object.keys(user).length > 0 ? <div className='pt-1 overflow-hidden w-100 h-100' >
            <div className="row w-100 h-100 overflow-hidden">

                <div ref={listInnerRef} onScroll={onScroll} className='col-12 d-flex row-gap-1 pb-3 flex-column align-items-center pe-0 h-100 overflow-y-scroll' >

                        {posts.map((post, idx) => {
                            return <PostItem post={post} key={idx}/>
                        })}
                        {isLoading && <div className='ps-auto pe-auto'>
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>}
                   

                </div>
            </div>
        </div> : <div></div>
    );
}

export default Posts
