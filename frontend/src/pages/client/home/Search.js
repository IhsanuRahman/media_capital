import React, { useEffect, useState } from 'react'
import { baseUrl } from '../../../constants'
import Markdown from 'markdown-to-jsx';
import api from '../../../axios';
import { useNavigate } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import PostItem from '../../../componets/client/PostItem';
import Posts from '../../../componets/client/Posts';

function Search() {
    const [posts, setPosts] = useState([])
    const [users, setUsers] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [focused, setFocused] = useState(false)
    const [prevent, setPrevent] = useState(false)
    const navigator = useNavigate()
    const [tab, setTab] = useState(0)
    const getResult = (value) => {
        api.get('/search', {

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`,

            },
            params: {
                search: value
            }
        }).then(resp => {
            setPosts(resp.data.posts)
            setUsers(resp.data.users)
        })
    }
    const postsView = () => {

        if (posts.length == 0 && searchValue !== '') {
            return <div className='d-flex  w-100'>
                <h1 className='text-secondary m-auto'>
                    no posts</h1></div>
        }
        return <div className='w-100  flex-column gap-2  d-flex overflow-y-scroll align-items-center hidescroller pt-2' >

            {posts.map((post, idx) => {
                return <PostItem key={idx} post={post} />
            })}
        </div>
    }
    const usersView = () => {
        if (users.length === 0 && searchValue !== '') {
            return <div className='d-flex w-100'>
                <h1 className='text-secondary m-auto'>
                    no users</h1></div>
        }
        return <div className='d-flex flex-column align-items-center w-100 '>{users.map((user,idx) =>
            <div key={idx} className='  rounded-1 d-flex p-2 mb-2 col-sm-9 col-12' style={{maxWidth:'400px', borderColor: '#494949', borderWidth: '2px ', borderStyle: 'solid' }}>
                <div className='bg-light rounded-5' onClick={e => navigator('/user/' + user.id)} style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url('${baseUrl + user.profile}')` }}>
                </div>
                <div>
                    <h6 className='ms-3 mb-0 text-white ' onClick={e => navigator('/user/' + user.id)}>{user.username}</h6>
                    <p className='ms-4 mt-1  text-secondary' style={{ fontSize: '12px' }}> {user.first_name + ' ' + user.last_name}</p>
                </div>
            </div>)}</div>
    }
    return (
        <div className='w-100 reponsive-border flex-column gap-2  d-flex  align-items-center pt-2' style={{ maxHeight: (window.innerHeight - 150) + 'px', }}>
            <div className="w-100 d-flex flex-column justify-content-center " style={{ height: '100px' }}
            >
                <div className="d-flex align-items-center">
                    <input type="search" placeholder='search' value={searchValue}
                        onFocus={_ => setFocused(true)}
                        onBlur={_ => { !prevent && setFocused(false) }}
                        onKeyDown={e => {
                            if (e.key === "Enter") {
                                getResult(searchValue)
                                setFocused(false)

                            }
                        }}
                        onChange={e => {
                            setSearchValue(e.target.value)

                            api.get('/search-suggestion', {

                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem('access')}`,

                                },
                                params: {
                                    search: e.target.value
                                }
                            }).then(resp => {
                                setSuggestions(resp.data.data)
                            })


                        }}
                        className='w-75 greyholder text-white ms-auto rounded-3 ps-2 border-0' style={{ height: '40px', backgroundColor: '#494949' }} />
                    <button className='me-auto  btn btn-outline-success' onClick={_ => getResult(searchValue)}>search</button>
                </div>
                <div className='d-flex justify-content-center ' >
                    {suggestions.length > 0 && focused && <div className="position-absolute mt-1 rounded mb-1 pb-1 bg-white w-50 ms-auto me-auto ">
                        {suggestions.map((suggestion,idx) =>
                            <div key={idx} className="col text-dark border-bottom border-2 text-break cursor-pointer" style={{ height: '25px' ,overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'  }}
                                onClick={e => {
                                    setPrevent(false)
                                    setSearchValue(suggestion[0])
                                    setFocused(false)
                                    getResult(suggestion[0])

                                }}
                                onMouseEnter={e => {
                                    setPrevent(true)
                                }}
                                onMouseLeave={e => {
                                    setPrevent(false)
                                }}
                            >{suggestion}</div>
                        )}


                    </div>}
                </div>
            </div>
            <div className='w-100 d-flex justify-content-center '>
                <div className='d-flex col-12 col-sm-6 ' style={{ height: '40px' }}>
                    <button className={`border-0 w-50 tab-btn-secondary border-end border-secondary rounded-start text-white bg-secondary bg-opacity-${tab == 0 ? '50' : '25'}`}
                        onClick={e => {
                            if (tab !== 0) {
                                setTab(0)
                            }
                        }}
                    >posts</button>
                    <button className={`border-0 w-50 tab-btn-secondary rounded-end  text-white bg-secondary bg-opacity-${tab == 1 ? '50' : '25'}`}
                        onClick={e => {
                            if (tab !== 1) {
                                setTab(1)
                            }
                        }}>users</button>
                </div>
            </div>

            <hr className='w-100' style={{ height: '80%' }} />
            <div className='hidescroller  gap-1 h-75 overflow-scroll w-100 '  >

                {tab == 0 ?
                    postsView() : usersView()}
            </div>
        </div>
    )
}

export default Search
