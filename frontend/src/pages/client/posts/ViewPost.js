import React, { useEffect, useState } from 'react'
import { baseUrl } from '../../../constants'
import ratingSvg from '../../../assets/Star.svg';
import ratingHalfSvg from '../../../assets/Half_filled_star.svg';
import ratingFullSvg from '../../../assets/Filled_star.svg';
import option from '../../../assets/options.svg';
import Markdown from 'markdown-to-jsx'
import api from '../../../axios';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '../../../componets/client/Header';
import { Stack, Rating } from '@mui/material';

function ViewPost() {
    const { id } = useParams()
    const [comment, setComment] = useState('')
    const [post, setPost] = useState()
    console.log(id);
    const navigator = useNavigate()
    const getPost = () => {
        api.get('/posts/get', {
            params: { 'id': id },
        }).then(e => {
            console.log('resp', e.data.post);
            setPost(e.data.post)
        }).catch(e => {
            return navigator('/')
        })


    }
    useEffect(() => {
        getPost()
    }, [id])
    return (
        <div className='pt-5 h-100 w-100'>
            <Header />
            {post && <div className='w-100 reponsive-border flex-column gap-2  d-flex overflow-y-scroll align-items-center hidescroller pt-2' style={{ maxHeight: (window.innerHeight - 90) + 'px', }}>
                <div className='  rounded-1 ' style={{ width: '600px', borderColor: '#494949', borderWidth: '2px ', borderStyle: 'solid' }}>
                    <div className='d-flex align-items-center ps-2   w-100 ' style={{ minHeight: "45px", maxHeight: "45px", borderColor: '#494949', borderWidth: '0 0 2px 0', borderStyle: 'solid' }}>
                        <div className='bg-light rounded-5' style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url(${baseUrl + post.user.profile})` }}>
                        </div>
                        <h6 className='ms-3'>{post.user.username}</h6>
                    </div>
                    <div className='w-100' style={{ borderColor: '#494949', borderWidth: '0 0 2px 0', borderStyle: 'solid' }}>
                        <img src={baseUrl + post.image} alt="" style={{ width: '100%', height: '550px' }} />
                    </div>
                    <div className='w-100 justify-content-between d-flex flex-column ' style={{}}>
                        <h6>All over:</h6>
                        <Stack spacing={1} >
                            <Rating name="half-rating-read" defaultValue={post.rating} precision={0.1} readOnly emptyIcon={
                                <img src={ratingSvg} alt="" srcset="" />} />
                            <h6>Your Rating:</h6>
                            <Rating name="half-rating" defaultValue={post.my_rate} precision={0.1}
                                onChange={(event, newValue) => {
                                    api.put('/posts/rate/add', {
                                        id: post.id,
                                        rate: newValue
                                    }).then(e => {

                                        getPost()
                                    })
                                }}
                                emptyIcon={
                                    <img src={ratingSvg} alt="" srcset="" />} />
                        </Stack>

                        <Markdown className={`ms-3 text-break `}  >{post.description}</Markdown>
                        <hr />
                        <h5 className='ps-2'>Comments</h5>

                        <div className='d-flex gap-2 align-self-end mt-3  mb-2 justify-content-start w-100'>
                            <input type="text" name="" placeholder="comment" value={comment}
                                onChange={e => {
                                    setComment(e.target.value)
                                }}
                                className="form-control w-50 ms-2 rounded-5 text-white whiteholder border-0" style={{ height: '25px', backgroundColor: '#494949' }} />
                            <button className='w-25 rounded-pill border-0 text-white fwbold' style={{ backgroundColor: '#233543' }}
                                onClick={e => {
                                    setComment('')
                                    if (comment!==''){
                                    api.post('posts/comment/add', {
                                        post_id: post.id,
                                        comment: comment,
                                    }).then(e => {

                                        getPost()
                                    })
                                }
                                }}
                            >post</button>
                        </div>{post.comments.map((comment) =>
                            <div className="d-flex border rounded ms-2 mb-1 me-2 p-1 align-items-center ps-2">
                                <div className='bg-light rounded-5' style={{ height: '35px', width: '35px ', backgroundSize: 'cover', backgroundImage: `url(${baseUrl + comment.profile})` }}>
                                </div>
                                <div>
                                    <p className='ms-3 mb-0  text-secondary' style={{ fontSize: '12px' }}> {comment.user}</p>
                                    <p className='ms-4 mt-1 text-white text-break  '>{comment.comment}</p>
                                </div>

                            </div>)}
                    </div>
                </div>
            </div>}</div>
    )
}

export default ViewPost
