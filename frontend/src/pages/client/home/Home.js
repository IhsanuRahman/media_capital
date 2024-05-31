import React, { Suspense, useEffect, useState } from 'react';
import Header from '../../../componets/client/Header';
import Navbar from '../../../componets/client/Navbar';
import Messages from '../../../componets/client/Messages';
import '../style.css'
import { useSelector } from 'react-redux';
import api from '../../../axios';
import Search from '../../../componets/client/Search';
import { Toast } from 'bootstrap';
const Posts = React.lazy(() => import('../../../componets/client/Posts'))

export function Home() {
    const [tab, setTab] = useState(0)
    const { isAuthenticated, user, loading } = useSelector(state => state.user);
    const [posts, setPosts] = useState([])
    
    useEffect(() => {
        api.get('/posts', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`,

            },

        }).then(e => {
            console.log(e.data.posts);
            setPosts(e.data.posts)
        }).catch(e => {
            console.log(e);
        })
        
    }, [])
    const tabs = [
        <Posts posts={posts} />,
        null, null, <Search />
    ]

    return (

        Object.keys(user).length > 0 ? <div className='pt-5 h-100 w-100'>
            <Header />
            <div className="row w-100 ">
                <div className='col-12 col-lg-9 pe-0'>
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
