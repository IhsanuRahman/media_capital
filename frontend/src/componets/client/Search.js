import React, { useEffect, useState } from 'react'
import { baseUrl } from '../../constants'
import Markdown from 'markdown-to-jsx';
import api from '../../axios';
import { useNavigate } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

function Search() {
    const [posts, setPosts] = useState([])
    const [users, setUsers] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const navigator = useNavigate()
    const [tab, setTab] = useState(0)

    return (
        <div className='w-100 reponsive-border flex-column gap-2  d-flex  align-items-center pt-2' style={{ maxHeight: (window.innerHeight - 150) + 'px', }}>
            <div className="w-100 d-flex justify-content-center ">
                <input type="search" placeholder='search' value={searchValue}
                    onChange={e => {
                        setSearchValue(e.target.value)
                        if (e.target.value !== '') {
                            api.get('/search', {
                                params: {
                                    search: e.target.value
                                }
                            }).then(resp => {
                                setPosts(resp.data.posts)
                                setUsers(resp.data.users)
                            })
                        }
                    }}
                    className='w-75 greyholder text-white ms-auto me-auto rounded-3 ps-2 border-0' style={{ height: '30px', backgroundColor: '#494949' }} />

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

            <hr  className='w-100'/>
            <div className='hidescroller  gap-1 overflow-y-scroll'>

                {tab == 0 ? posts.map((post, idx) => {

                    return <div className='  rounded-1 ' style={{ width: '400px', borderColor: '#494949', borderWidth: '2px ', borderStyle: 'solid' }}>
                        <div className='d-flex align-items-center ps-2   w-100 ' style={{ minHeight: "45px", maxHeight: "45px", borderColor: '#494949', borderWidth: '0 0 2px 0', borderStyle: 'solid' }}>
                            <div className='bg-light rounded-5' onClick={e => navigator('/user/' + post.user.id)} style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url(${baseUrl + post.user.profile})` }}>
                            </div>
                            <h6 className='ms-3' onClick={e => navigator('/user/' + post.user.id)}>{post.user.username}</h6>
                        </div>
                        <div className='w-100' style={{ borderColor: '#494949', borderWidth: '0 0 2px 0', borderStyle: 'solid' }}
                            onClick={e => {
                                navigator('/post/' + post.id)
                            }}
                        >
                            <img src={baseUrl + post.image} alt="" style={{ width: '100%', height: '350px' }} />
                        </div>
                        <div className='w-100 justify-content-between d-flex flex-column ' style={{}}>
                            <Stack spacing={1}>
                                <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
                                <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
                            </Stack>

                            {<Markdown className={`ms-3 text-break `} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.description}</Markdown>}


                            <div className='d-flex gap-2 align-self-end  mb-2 justify-content-start w-100'>
                                {/* <input type="text" name="" placeholder="comment" className="form-control w-50 ms-2 rounded-5 text-white whiteholder border-0" style={{ height: '25px', backgroundColor: '#494949' }} />
                                    <button className='w-25 rounded-pill border-0 text-white fwbold' style={{ backgroundColor: '#233543' }}
                                    onClick={e=>{
                                        api.post('posts/comment/add',{
                                            post_id:post.id,
                                            comment:comment,
                                        })
                                    }}
                                    >post</button> */}
                            </div>
                        </div>
                    </div>
                }) : users.map(user =>
                    <div className='  rounded-1 d-flex p-2 mb-2' style={{ width: '400px', borderColor: '#494949', borderWidth: '2px ', borderStyle: 'solid' }}>
                        <div className='bg-light rounded-5' onClick={e => navigator('/user/' + user.id)} style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url('${baseUrl + user.profile}')` }}>
                        </div>
                        <div>
                            <h6 className='ms-3 mb-0 text-white ' onClick={e => navigator('/user/' + user.id)}>{user.username}</h6>
                            <p className='ms-4 mt-1  text-secondary' style={{ fontSize: '12px' }}> {user.first_name + ' ' + user.last_name}</p>
                        </div>
                    </div>)}
            </div>
        </div>
    )
}

export default Search
