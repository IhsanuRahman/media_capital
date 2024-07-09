import React, { useEffect, useRef, useState } from 'react'
import api from '../../../axios';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '../../../componets/admin/Header';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../../componets/admin/Navbar';
import ArrowLeftTwoToneIcon from '@mui/icons-material/ArrowLeftTwoTone';

function CreateNotification() {
    const { user } = useSelector(state => state.user)
    const { id } = useParams()
    const [spinner, setSpinner] = useState(false)
    const dispatch = useDispatch()
    const navigator = useNavigate()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')


    const submitHandler = () => {
        if (title !== '' && description !== '') {
            api.post('admin/notification/create', {
                title,
                description
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                },
            }).then(e => {
                navigator('/admin')
            }).catch(e => {
            })
        }


    }


    return (
        <div className='pt-5 bg-main text-dark d-flex justify-content-center align-items-center  h-100 w-100'>
            <Header leading={
                <ArrowLeftTwoToneIcon className='text-dark cursor-pointer h-100 fs-1' onClick={e => { navigator('/admin?tab=4') }} />
            } />
            <div className='row h-100 d-flex w-100' >
                <Navbar idx={4} />

                <div className="col pe-0 overflow-hidden h-100">
                    <div className='h-100 d-flex flex-column '>
                        <div className='d-flex mt-3 w-100 ps-5 mb-5' style={{ height: '80px' }}>
                            <h3 >Create Notification</h3></div>
                        <div className='d-flex h-auto flex-column justify-content-center align-content-center w-75 mx-auto'>
                            <label htmlFor="title" className="col-form-label">Title:</label>

                            <input type="text" className="form-control" id="title"
                                onChange={e => {
                                    setTitle(e.target.value)
                                }}
                            />
                            <label htmlFor="description" className="col-form-label">Description:</label>

                            <textarea type="text" className="form-control" id="description"
                                rows={5}
                                onChange={e => {
                                    setDescription(e.target.value)
                                }}
                            /> 
                        </div>
                       <div className='w-100 d-flex mt-auto'>
                            <button className='btn btn-success  mt-auto mb-5 ms-auto me-4' onClick={submitHandler}>
                                submit
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default CreateNotification
