import React, { useState } from 'react'
import Header from '../../../componets/admin/Header'
import '../styles.css'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../../constants';
import { checkAuth } from '../../../features/user';
import api from '../../../axios';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
function CreateNotification() {
    const [spinner, setSpinner] = useState(false)
    const dispatch = useDispatch()
    const navigator = useNavigate()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')


    const submitHandler = () => {
        if (title!==''&& description!==''){
            api.post('admin/notification/create',{
                title,
                description
            },{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                },
            }).then(e=>{
                navigator('/admin')
            }).catch(e=>{
                console.log(e)
            })
        }


    }
    return (
        <div className='bg-main text-dark overflow-y-scroll d-flex flex-column ' style={{ height: '100%', weight: '100%', paddingTop: '50px' }}>
            <Header />
            <div>
                <div className='d-flex mt-3 w-100 ps-5 mb-5' style={{ height: '80px' }}>
                    <h3 >Create Notification</h3></div>
                <div className='d-flex h-auto flex-column justify-content-center align-content-center w-75 m-auto'>
                    <label for="title" class="col-form-label">Title:</label>

                    <input type="text" className="form-control" id="title"
                        onChange={e=>{
                            setTitle(e.target.value)
                        }}
                    />
                    <label for="description" class="col-form-label">Description:</label>

                    <textarea type="text" className="form-control" id="description"
                        rows={5}
                        onChange={e=>{
                            setDescription(e.target.value)
                        }}
                    />
                </div>
                
            </div><button className='btn btn-success mt-auto mb-5 ms-auto me-5' onClick={submitHandler}>
                    submit
                </button>
        </div>
    )
}

export default CreateNotification
