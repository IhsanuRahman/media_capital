import React, { useMemo, useState } from 'react'
import Header from '../../../componets/client/Header'
import MarkdownEditor from '@uiw/react-markdown-editor';
import api from '../../../axios';
import { useNavigate } from 'react-router-dom';
import './post.css'


function CreatePosts() {
    const navigator = useNavigate()
    const [alert, setAlert] = useState('')
    const [tags, setTags] = useState([])
    const [tag, setTag] = useState('')
    const [image, setImage] = useState(null)
    const [description, setDescription] = useState('')
    const [spinner, setSpinner] = useState(false)
    const Image = useMemo(() => {
        return <div className=' border rounded-3 align-content-center post-item mx-3' style={{ height: '600px', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundImage: `url(${image && URL.createObjectURL(image)})` }} >
            <input type="file" name="" id="d" placeholder='' className='h-100  file-input w-100 hover ' onChange={e => {
                setImage(e.target.files[0])
            }} style={image && { color: 'transparent' }} />
        </div>
    }, [image]);
    const handleSubmit = () => {

        if (image === null) {
            setAlert('image is required')
        } else if (alert === '') {
            setSpinner(true)
            const formData = new FormData()
            formData.append('image', image)
            formData.append('tags', JSON.stringify(tags))
            formData.append('description', description)
            api.post('/posts/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                },
            }).then(e => {
                setSpinner(false)
                navigator('/')
            }).catch(e => {
                setSpinner(false)
            })
        }
    }
    return (
        <div className='overflow-y-auto  pt-5 w-100' style={{ marginTop: '50px', height: 'calc(100% - 60px)' }}>

            <Header />
            {alert && <div className="alert d-flex z-1 position-fixed w-75 align-items-center justify-content-between m-2 alert-danger  alert-dismissible fade show pe-0" role="alert">
                {alert}
                <button className='btn mt-auto ' type="button" data-dismiss="alert" aria-label="Close"
                    onClick={_ => setAlert('')}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>}
            <div className="d-flex mt-2 w-100 align-items-center flex-md-row flex-md-row flex-column   justify-content-around  ">
                {Image}
                <div className='col mx-1 mt-2'>
                    <div className='border border-white rounded h-75 p-4 '>
                        <h4 className='mb-3'>Tags</h4>
                        <div className='row clearfix gap-3 '>

                            {tags.map((tagObj, i) => <div key={i} className='rounded-5 col d-flex align-items-center ps-1 border-white border  p-1 text-center' >
                                {tagObj} <b className='btn ms-auto mb-1   ms-2 text-white ' onClick={
                                    e => {
                                        tags.splice(i, 1)
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
                                placeholder="add interests" id="" className='w-100 bg-black text-white border-0' />
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
                    <div className='mb-5  col'>
                        <MarkdownEditor

                            style={{ display: 'block', top: '50px', padding: '5px', minHeight: '100px' }}
                            value={description}
                            onChange={(value, viewUpdate) => {
                                setDescription(value)
                            }}
                        /></div><div className='w-100 ps-auto mt-5 ms-auto pe-3 d-flex'
                onClick={handleSubmit}
            >
                <button className='btn btn-success ms-auto p-1 ' style={{ width: '80px', height: '40px' }}>{spinner ? <span className=" spinner-border" aria-hidden="true"></span> : 'create'}</button>
            </div>
                </div>

            </div>

            
        </div>
    )
}

export default CreatePosts
