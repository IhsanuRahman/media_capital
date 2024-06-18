import React, { Suspense, useEffect, useRef, useState } from 'react';
import Header from '../../../componets/client/Header';
import Navbar from '../../../componets/client/Navbar';
import Messages from '../../../componets/client/Messages';
import '../style.css'
import { useSelector } from 'react-redux';
import api from '../../../axios';
import Search from '../../../componets/client/Search';
import { Toast } from 'bootstrap';
import PostItem from '../../../componets/client/PostItem';
import { Hidden, formHelperTextClasses } from '@mui/material';
import Recommended from './Recommended';
const Posts = React.lazy(() => import('../../../componets/client/Posts'))

export function Home() {
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
    const tabs = [
        <div ref={listInnerRef} onScroll={onScroll} className='w-100 reponsive-border flex-column gap-2  d-flex overflow-y-scroll align-items-center hidescroller pt-2 ' style={{ maxHeight: 'calc(100% - 95px)' }}  >

            {posts.map((post, idx) => {
                return <PostItem id={idx} post={post} />
            })}
            {isLoading && <div className='ps-auto pe-auto'>
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>}
        </div>,
        null, <Recommended/>, <Search />
    ]

    return (

        Object.keys(user).length > 0 ? <div className='pt-5 h-100 w-100'>
            <Header />
            <div className="row w-100 h-100">

                <div className='col-12 col-lg-9 pe-0 h-100 overflow-hidden'>
                    <Navbar tab={tab} setTab={setTab} />
                    <Suspense fallback={<div>Loading...</div>}>
                        {tabs[tab]}
                    </Suspense>

                </div>
                <Messages />
            </div>
        </div> : <div></div>
    );
}

export default Home
