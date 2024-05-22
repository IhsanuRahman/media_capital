import React, { useEffect, useRef } from 'react'
import { baseUrl } from '../../constants'
import ratingSvg from '../../assets/Star.svg';
import option from '../../assets/options.svg';
import Markdown from 'markdown-to-jsx'
import { useNavigate } from 'react-router-dom';
import api from '../../axios';
import { Rating, Stack } from '@mui/material';
function Posts({ posts }) {
    const ref = useRef()
    const navigator = useNavigate()
    useEffect(() => {


    }, [])
    return (

        <div ref={ref} className='w-100 reponsive-border flex-column gap-2  d-flex overflow-y-scroll align-items-center hidescroller pt-2' style={{ maxHeight: (window.innerHeight - 150) + 'px', }}>
            {posts.map((post, idx) => {

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
                    <div className='w-100 justify-content-between d-flex flex-column justify-content-between ' style={{}}>
                        <div className="d-flex w-100 ps-1">
                            <Stack spacing={1} className='d-flex flex-row'>
                                <div className="d-flex flex-column ">
                                    <h6 className='pt-2'>All over:</h6>
                                    <h6>Your Rating:</h6></div>

                                <div className="d-flex flex-column">
                                    <Rating name="half-rating-read" defaultValue={post.rating} precision={0.1} readOnly emptyIcon={
                                        <img src={ratingSvg} alt="" srcset="" />} />
                                    <Rating name="half-rating" defaultValue={post.my_rate} precision={0.1}
                                        onChange={(event, newValue) => {
                                            api.put('/posts/rate/add', {
                                                id: post.id,
                                                rate: newValue
                                            })
                                            post.rating = newValue
                                        }}
                                        emptyIcon={
                                            <img src={ratingSvg} alt="" srcset="" />} /></div>
                            </Stack>
                            <img src={option} alt="" srcset="" className='ms-auto' style={{cursor:'pointer'}}/>
                        </div>
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
            })}
        </div>
    )
}

export default Posts
