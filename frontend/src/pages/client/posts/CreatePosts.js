import React, { useState } from 'react'
import Header from '../../../componets/client/Header'
import MarkdownEditor from '@uiw/react-markdown-editor';
import api from '../../../axios';
import { useNavigate } from 'react-router-dom';

function CreatePosts() {
    const navigator= useNavigate()
    const [alert, setAlert] = useState('')
    const [tags, setTags] = useState([])
    const [tag, setTag] = useState('')
    const [image, setImage] = useState(null)
    const [description, setDescription] = useState('')
    const handleSubmit = () => {
        if (image===null){
            setAlert('image is required')
        }else if (alert === '') {
            const formData = new FormData()
            formData.append('image', image)
            formData.append('tags', JSON.stringify(tags))
            formData.append('description', description)
            api.post('/posts/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                },
            }).then(e=>{
                navigator('/')
            })
        }
    }
    return (
        <div className='overflow-y-scroll h-100 pt-5 w-100'>

            <Header />
            {alert && <div class="alert d-flex align-items-center justify-content-between m-2 alert-danger  alert-dismissible fade show pe-0" role="alert">
                {alert}
                <button className='btn mt-auto ' type="button" data-dismiss="alert" aria-label="Close"
                    onClick={_ => setAlert('')}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>}
            <div className="d-flex mt-2 w-100 align-items-center flex-md-row flex-colume   justify-content-around  ">
                <div className=' border rounded-3 align-content-center  ' style={{ height: '600px', width: '400px', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundImage: `url(${image && URL.createObjectURL(image)})` }} >
                    <input type="file" name="" id="d" placeholder='' className='h-100  file-input w-100 hover ' onChange={e => {
                        setImage(e.target.files[0])
                    }} style={image && { color: 'transparent' }} />
                </div>
                <div className='col-8'>
                    <div className='border border-white rounded h-75 p-4'>
                        <h4 className='mb-3'>Tags</h4>
                        <div className='row clearfix gap-3 '>

                            {tags.map((tagObj, i) => <div className='rounded-5 col d-flex align-items-center ps-1 border-white border  p-1 text-center' >
                                {tagObj} <b className='btn ms-auto mb-1   ms-2 text-white ' onClick={
                                    e => {
                                        setTags([...tags])
                                    }
                                }>x</b>
                            </div>)}

                        </div>
                        <div className='d-flex form-control bg-black text-black w-75  mt-3 rounded-5'>
                            <input type="text" value={tag}
                                onChange={e => {
                                    setTag(e.target.value)
                                }}
                                placeholder="add intresets" id="" className='w-100 bg-black text-white border-0' />
                            <div className=" ms-2 text-white " style={{ cursor: 'pointer' }}
                                onClick={e => {
                                    if (!tags.includes(tag) && tag !== '') {
                                        setTags([...tags, tag])
                                        setTag('')
                                    }
                                }}
                            > <b className='ms-auto me-2'>+</b>
                            </div>
                        </div>

                    </div>
                    <label htmlFor="" className='w-25'> Description:</label>
                    <div className='mb-5 pt-5 '>
                        <MarkdownEditor
                            style={{ marginTop: '45px', display: 'block', top: '50px' }}
                            value={description}
                            onChange={(value, viewUpdate) => {
                                setDescription(value)
                            }}
                        /></div>
                </div>

            </div>
            <div className='w-100 ps-auto mt-5 ms-auto pe-3 d-flex'
                onClick={handleSubmit}
            ><button className='btn btn-success ms-auto  '>create</button></div>

        </div>
    )
}

export default CreatePosts