import React, { useEffect, useState } from 'react'
import Header from '../../../componets/admin/Header'
import '../styles.css'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { baseUrl } from '../../../constants';
import { checkAuth } from '../../../features/user';
import api from '../../../axios';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { CreateUserValidator } from './helpers/validators';
function EditUser() {
    const {id}= useParams()
    const [spinner, setSpinner] = useState(false)
    const dispatch = useDispatch()
    const navigator = useNavigate()
    const [interest, setInterest] = useState('')

    const [userData, setUserData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        password: '',
        confirm_password: '',
        dob: '',
        banner: '',
        interests: [],
        email: '',
        description: '',
        profile: '',
        is_staff:false
    })
    const [errors, setErrors] = useState({
        username: '',
        first_name: '',
        last_name: '',
        dob: '',
        email: '',
    })
    useEffect(()=>{
        api.get('/admin/user', {
            params: { 'id': id },
            headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` },
          }).then(e => {
            setUserData(e.data.userData)})
    },[])
    console.log(typeof userData.profile);
    const submitHandler = () => {

        setSpinner(true)
        if (CreateUserValidator(errors, userData)) {
            let form_data = new FormData();
            if (typeof userData.profile !== 'string') {
                console.log('passing image')
                form_data.append("profile", userData.profile, userData.profile.name);
            }
            form_data.append("username", userData.username);
            form_data.append("first_name", userData.first_name);
            form_data.append("last_name", userData.last_name);
            console.log(typeof userData.banner);
            if (typeof userData.banner !== 'string' && userData.banner !== null)
                form_data.append('banner', userData.banner)
            if (typeof userData.profile !== 'string' && userData.profile !== null)
                form_data.append('profile', userData.profile)
            form_data.append('interests', JSON.stringify(userData.interests))
            form_data.append('dob', userData.dob)
            form_data.append('description', userData.description)
            form_data.append('email', userData.email)
            form_data.append('password', userData.password)
            form_data.append('is_superuser', userData.is_superuser)
            api.post('/admin/user/create', form_data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                },
            }).then(e => {

                dispatch(checkAuth())
                setSpinner(false)
                return navigator('/admin')
            }).catch(e => {
                console.log(e)
                try {
                    const serverErrors = e.response.data
                    setErrors({ ...errors, ...serverErrors })
                } catch {
                    console.log(e)
                }
                setSpinner(false)
            })
        } else {
            setSpinner(false)
            setErrors({ ...errors })
        }
    }
    return (
        <div className='bg-main text-dark overflow-y-scroll d-flex flex-column justify-content-center align-items-center' style={{ height: '100%', weight: '100%', paddingTop: '50px' }}>
            <Header />
            <div className="w-100 bg-white h-25" >
                <input type="file" accept=".jpg,.jpeg,.svg,.avif,.gif,.png" name="" id="" placeholder='' className='w-100 h-100 mt-auto m-0 file-input ' style={{ cursor: 'pointer',backgroundSize: 'cover', color: 'transparent', backgroundImage: `${userData.banner !== null && `url(${typeof userData.banner === 'string' ? userData.banner : URL.createObjectURL(userData.banner)})`}` }}
                    onChange={(e) => {
                        setUserData({ ...userData, banner: e.target.files[0] })
                    }}
                />
            </div>
            <div className='w-100 h-75  d-flex row ' >
                <div className="align-items-center d-flex flex-column ps-5  " style={{ width: '200px' }}>
                    <div className=' rounded-circle d-flex flex-column    bg-secondary  ' style={{ cursor: 'pointer', height: '150px', minWidth: '150px ', backgroundSize: 'cover', marginTop: '-50px', backgroundImage:  `url(${typeof userData.profile === 'string' ? userData.profile : URL.createObjectURL(userData.profile)})`  }}  >
                        <input type="file" accept=".jpg,.jpeg,.svg,.avif,.gif,.png" name="" id="" placeholder='' className='w-100 h-100 mt-auto m-0  rounded-circle  file-input ' style={{ cursor: 'pointer', color: 'transparent' }}
                            onChange={(e) => {
                                setUserData({ ...userData, profile: e.target.files[0] })
                            }}
                        />

                    </div>
                </div>
                <div className=' w-max d-flex'>
                    <div className='d-flex gap-3  flex-column w-75 p-5'>

                        <input type="text" value={userData.username} className='form-control bg-main border-dark' placeholder='username' style={{ height: '35px', Top: '45px' }}
                            onChange={(e) => {
                                setUserData({ ...userData, username: e.target.value })
                            }}
                        />
                        {errors.username !== '' && <li className="text-danger ms-2">{errors.username}</li>}
                        <div className="d-flex gap-1 w-100">
                            <div className='d-flex w-50 flex-column gap-2'>
                                <input type="text" value={userData.first_name} className='form-control bg-main border-dark' placeholder='first name' name="" id="" style={{ height: '35px' }}
                                    onChange={(e) => {
                                        setUserData({ ...userData, first_name: e.target.value })
                                    }}
                                />
                                {errors.first_name !== '' && <li className="text-danger ms-2">{errors.first_name}</li>}


                            </div>
                            <div className='d-flex w-50 flex-column gap-2'><input type="text" value={userData.last_name} className='form-control bg-main border-dark' placeholder='last name' name="" id="" style={{ height: '35px' }}
                                onChange={(e) => {
                                    setUserData({ ...userData, last_name: e.target.value })
                                }} />
                                {errors.last_name !== '' && <li className="text-danger ms-2">{errors.last_name}</li>}
                            </div>
                        </div>
                        <input type="email" readonly value={userData.email} className='form-control  bg-main border-dark' placeholder='email' style={{ height: '35px' }}
                            onChange={(e) => {
                                setUserData({ ...userData, email: e.target.value })
                            }}
                        />
                        {errors.email !== '' && <li className="text-danger ms-2">{errors.email}</li>}
                        <label htmlFor="" className='fw-bold'>date of birth: </label>
                        <input type="date" value={userData.dob} className='form-control  bg-main border-dark' placeholder='date of birth' name="" id="" style={{ height: '35px' }}
                            onChange={(e) => {
                                setUserData({ ...userData, dob: e.target.value })
                            }}
                        />
                        {errors.dob !== '' && <li className="text-danger ms-2">{errors.dob}</li>}
                        <textarea name="description" value={userData.description} className='form-control bg-main border-dark   ' id="" placeholder="description" rows={4}
                            onChange={(e) => {
                                setUserData({ ...userData, description: e.target.value })
                            }}
                        ></textarea>
                        
                    </div>
                    <div className="w-25 p-3 d-flex flex-column">
                        <div className='border border-dark rounded h-75 p-4'>
                            <h4 className='mb-3'>Interests</h4>
                            <div className='row clearfix gap-3 '>

                                {userData?.interests?.map((intreset, i) => <div className='rounded-5 col d-flex align-items-center ps-2 border-dark border  p-1 text-center' >
                                    {intreset} <b className='btn ms-auto mb-1   ms-2 text-dark ' onClick={
                                        e => {
                                            let interests = [...userData.interests]
                                            interests.splice(i, 1)
                                            setUserData({ ...userData, interests: interests })
                                        }
                                    }><CancelIcon /></b>
                                </div>)}

                            </div>
                            <div className='d-flex form-control w-75 border border-dark bg-transparent  mt-3 rounded-5'>
                                <input type="text" value={interest}
                                    onChange={e => {
                                        setInterest(e.target.value)
                                    }}
                                    placeholder="add interests" id="" className='w-75 bg-transparent text-dark  border-0' />
                                <div className=" ms-2  " style={{ cursor: 'pointer' }}
                                    onClick={e => {
                                        if (!userData.interests.includes(interest) && interest !== '') {
                                            userData.interests = [...userData.interests, interest]
                                            setUserData({ ...userData })
                                            setInterest('')
                                        }
                                    }}
                                > <b className='me-0 pe-0'><AddCircleIcon /></b></div></div>

                        </div>
                        <button className="btn btn-success mb-3 mt-auto ms-auto me-3" style={{ height: '50px', width: '110px' }} onClick={submitHandler}>{spinner ? <span class="spinner-border" aria-hidden="true"></span> : 'save'}</button>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default EditUser
