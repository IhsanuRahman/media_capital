import React, { useEffect, useState } from 'react'
import { baseUrl } from '../../constants'
import Markdown from 'markdown-to-jsx';
import api from '../../axios';
import { useNavigate } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import PostItem from './PostItem';
import Posts from './Posts';

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
            return <div>
                <h1 className='text-secondary'>
                    no posts</h1></div>
        }
        return <div  className='w-100  flex-column gap-2  d-flex overflow-y-scroll align-items-center hidescroller pt-2' >

            {posts.map((post, idx) => {
                return <PostItem id={idx} post={post} />
            })}
        </div>

        // posts.map((post, idx) => {
        //     return <div className='  rounded-1 ' style={{ width: '400px', borderColor: '#494949', borderWidth: '2px ', borderStyle: 'solid' }}>
        //         <div className='d-flex align-items-center ps-2   w-100 ' style={{ minHeight: "45px", maxHeight: "45px", borderColor: '#494949', borderWidth: '0 0 2px 0', borderStyle: 'solid' }}>
        //             <div className='bg-light rounded-5' onClick={e => navigator('/user/' + post.user.id)} style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url(${baseUrl + post.user.profile})` }}>
        //             </div>
        //             <h6 className='ms-3' onClick={e => navigator('/user/' + post.user.id)}>{post.user.username}</h6>
        //         </div>
        //         <div className='w-100' style={{ borderColor: '#494949', borderWidth: '0 0 2px 0', borderStyle: 'solid' }}
        //             onClick={e => {
        //                 navigator('/post/' + post.id)
        //             }}
        //         >
        //             <img src={baseUrl + post.image} alt="" style={{ width: '100%', height: '350px' }} />
        //         </div>
        //         <div className='w-100 justify-content-between d-flex flex-column ' style={{}}>
        //             <Stack spacing={1}>
        //                 <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
        //                 <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
        //             </Stack>

        //             {<Markdown className={`ms-3 text-break `} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.description}</Markdown>}


        //             <div className='d-flex gap-2 align-self-end  mb-2 justify-content-start w-100'>
        //                 {/* <input type="text" name="" placeholder="comment" className="form-control w-50 ms-2 rounded-5 text-white whiteholder border-0" style={{ height: '25px', backgroundColor: '#494949' }} />
        //                 <button className='w-25 rounded-pill border-0 text-white fwbold' style={{ backgroundColor: '#233543' }}
        //                 onClick={e=>{
        //                     api.post('posts/comment/add',{
        //                         post_id:post.id,
        //                         comment:comment,
        //                     })
        //                 }}
        //                 >post</button> */}
        //             </div>
        //         </div>
        //     </div>
        // })
    }
    const usersView = () => {
        if (users.length === 0 && searchValue !== '') {
            return <div>
                <h1 className='text-secondary'>
                    no users</h1></div>
        }
        return users.map(user =>
            <div className='  rounded-1 d-flex p-2 mb-2' style={{ width: '400px', borderColor: '#494949', borderWidth: '2px ', borderStyle: 'solid' }}>
                <div className='bg-light rounded-5' onClick={e => navigator('/user/' + user.id)} style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url('${baseUrl + user.profile}')` }}>
                </div>
                <div>
                    <h6 className='ms-3 mb-0 text-white ' onClick={e => navigator('/user/' + user.id)}>{user.username}</h6>
                    <p className='ms-4 mt-1  text-secondary' style={{ fontSize: '12px' }}> {user.first_name + ' ' + user.last_name}</p>
                </div>
            </div>)
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
                            console.log(e.key);
                            if (e.key === "Enter"){
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
                                console.log('suggestions', resp.data.data)
                                setSuggestions(resp.data.data)
                            })


                        }}
                        className='w-75 greyholder text-white ms-auto rounded-3 ps-2 border-0' style={{ height: '40px', backgroundColor: '#494949' }} />
                    <button className='me-auto  btn btn-outline-success' onClick={_ => getResult(searchValue)}>search</button>
                </div>
                <div className='d-flex justify-content-center ' >
                    {suggestions.length > 0 && focused && <div className="position-absolute mt-1 rounded mb-1 pb-1 bg-white w-50 ms-auto me-auto ">
                        {suggestions.map(suggestion =>
                            <div className="col text-dark border-bottom border-2 cursor-pointer" style={{ height: '25px' }}
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
                <button className={`btn text-white  ${tab == 0 ? 'active' : 'text-decoration-underline'}`}
                    onClick={e => {
                        if (tab !== 0) {
                            setTab(0)
                        }
                    }}>
                    posts
                </button>
                <button className={`btn text-white   ${tab == 1 ? 'active' : 'text-decoration-underline'}`}
                    onClick={e => {
                        if (tab !== 1) {
                            setTab(1)
                        }
                    }}
                >
                    users
                </button>
            </div>

            <hr className='w-100' style={{ height: '80%' }} />
            <div className='hidescroller  gap-1 h-75 overflow-scroll ' >

                {tab == 0 ?
                    postsView() : usersView()}
            </div>
        </div>
    )
}

export default Search
