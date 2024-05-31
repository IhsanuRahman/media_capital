import React, { useState } from 'react'
import Header from '../../../componets/client/Header';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../../axios';
import { checkAuth } from '../../../features/user';
import {ProfileValidator} from '../auth/helpers/Validations';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../../constants';

function EditProfile() {
    const [spinner, setSpinner] = useState(false)
    const { isAuthenticated, user, loading } = useSelector(state => state.user);
    const dispatch = useDispatch()
    const navigator =useNavigate()
    const [tab, setTab] = useState(0)
    const [interest, setInterest] = useState('')
    const initialData={
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        dob: user.dob,
        banner:`${baseUrl+user.banner}`,
        interests:user.intresets,
        description: user.description,
        email: user.email,
        profile: `${baseUrl+user.profile}`
    }
    const [userData, setUserData] = useState({
        ...initialData
    })
    const [errors, setErrors] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        dob: '',
        password: '',
        conform_password: ''
    })
    console.log(typeof userData.profile);
    const submitHandler = () => {
        setSpinner(true)
        if (ProfileValidator(errors, userData)) {
            let form_data = new FormData();
            if (typeof userData.profile !== 'string') {
                console.log('passing image')
                form_data.append("profile", userData.profile, userData.profile.name);
            }
            form_data.append("username", userData.username);
            form_data.append("first_name", userData.first_name);
            form_data.append("last_name", userData.last_name);
            form_data.append('email', userData.email)
            console.log(typeof userData.banner);
            if (typeof userData.banner!=='string' && userData.banner!==null)
                form_data.append('banner', userData.banner)
            if (typeof userData.profile!=='string' && userData.profile!==null)
                form_data.append('profile', userData.profile)
            form_data.append('intresets', JSON.stringify(userData.interests))
            form_data.append('dob', userData.dob)
            form_data.append('description', userData.description)
            api.put('/profile/edit', form_data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                },
            }).then(e => {

                dispatch(checkAuth())
                setSpinner(false)
                return navigator('/profile')
            }).catch(e => {
                console.log(e)
                try{
                    const serverErrors = e.response.data.message
                    setErrors({ ...errors, ...serverErrors })
                }catch{
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
        <div className='w-100 h-100  overflow-y-scroll overflow-x-hidden ' style={{  maxWidth: '100%',paddingTop: '50px' ,paddingBottom: '100px'  }} >
            <Header />
            <div className="w-100 bg-white h-25">
            <input type="file" accept=".jpg,.jpeg,.svg,.avif,.gif,.png" name="" id="" placeholder='' className='w-100 h-100 mt-auto m-0 file-input ' style={{ cursor: 'pointer', color: 'transparent', backgroundImage: `${userData.banner!==null&&`url(${typeof userData.banner === 'string' ? userData.banner : URL.createObjectURL(userData.banner)})`}` }}
                            onChange={(e) => {
                                setUserData({ ...userData, banner: e.target.files[0] })
                            }}
                        />
            </div>
            <div className='w-100 h-75  d-flex row ' >
                <div className="align-items-center d-flex flex-column ps-5 hover-change " style={{ width: '200px' }}>
                    <div className=' rounded-circle d-flex flex-column    bg-secondary  ' style={{ cursor: 'pointer', height: '150px', minWidth: '150px ', backgroundSize: 'cover', marginTop: '-50px', backgroundImage: `url(${typeof userData.profile === 'string' ? userData.profile : URL.createObjectURL(userData.profile)})` }}  >
                        <input type="file" accept=".jpg,.jpeg,.svg,.avif,.gif,.png" name="" id="" placeholder='' className='w-100 h-100 mt-auto m-0  rounded-circle  file-input ' style={{ cursor: 'pointer', color: 'transparent' }}
                            onChange={(e) => {
                                setUserData({ ...userData, profile: e.target.files[0] })
                            }}
                        />

                    </div>
                </div>
                <div className=' w-max d-flex'>
                    <div className='d-flex gap-3  flex-column w-75 p-5'>
                        <input type="text" value={userData.username} className='form-control bg-black text-white whiteholder' placeholder='username' style={{ height: '35px', Top: '45px' }}
                            onChange={(e) => {
                                setUserData({ ...userData, username: e.target.value })
                            }}
                        />
                        {errors.username !== '' && <li className="text-danger ms-2">{errors.username}</li>}
                        <div className='d-flex gap-2'>
                            <input type="text" value={userData.first_name} className='form-control bg-black text-white whiteholder' placeholder='first name' name="" id="" style={{ height: '35px' }}
                                onChange={(e) => {
                                    setUserData({ ...userData, first_name: e.target.value })
                                }}
                            />
                            <input type="text" value={userData.last_name} className='form-control bg-black text-white whiteholder' placeholder='last name' name="" id="" style={{ height: '35px' }}
                                onChange={(e) => {
                                    setUserData({ ...userData, last_name: e.target.value })
                                }}
                            />
                        </div>
                        <div className='d-flex gap-2'>
                        {errors.first_name !== '' && <li className="text-danger ms-2">{errors.first_name}</li>}
                        {errors.last_name !== '' && <li className="text-danger ms-2">{errors.last_name}</li>}
                        </div>
                        <input type="email" value={userData.email} className='form-control bg-black text-white whiteholder' placeholder='Email' name="" id="" style={{ height: '35px' }}
                            onChange={(e) => {
                                setUserData({ ...userData, email: e.target.value })
                            }}
                        />
                        {errors.email !== '' && <li className="text-danger ms-2">{errors.email}</li>}
                        <label htmlFor="" className='fw-bold'>date of birth: </label>
                        <input type="date" value={userData.dob} className='form-control bg-black text-white whiteholder' placeholder='date of birth' name="" id="" style={{ height: '35px' }}
                            onChange={(e) => {
                                setUserData({ ...userData, dob: e.target.value })
                            }}
                        />
                        <textarea name="description" value={userData.description} className='form-control bg-black text-white whiteholder' id="" placeholder="description" rows={5}
                            onChange={(e) => {
                                setUserData({ ...userData, description: e.target.value })
                            }}
                        ></textarea>

                    </div>
                    <div className="w-25 p-3">
                        <div className='border border-white rounded h-75 p-4'>
                            <h4 className='mb-3'>Interests</h4>
                            <div className='row clearfix gap-3 '>

                               {userData.interests.map((intreset,i)=> <div className='rounded-5 col d-flex align-items-center ps-1 border-white border  p-1 text-center' >
                               {intreset} <b className='btn ms-auto mb-1   ms-2 text-white ' onClick={
                                e=>{
                                    let interests=[...userData.interests]
                                    interests.splice(i,1)
                                setUserData({...userData,interests:interests})
                                }
                               }>x</b>
                                </div>)}

                            </div>
                            <div className='d-flex form-control bg-black text-black w-75  mt-3 rounded-5'>
                                <input type="text" value={interest}
                                onChange={e=>{
                                    setInterest(e.target.value)
                                }}
                                placeholder="add intresets" id="" className='w-75 bg-black text-white border-0' />
                            <div className=" ms-2 text-white " style={{cursor:'pointer'}}
                            onClick={e=>{
                                if (!userData.interests.includes(interest) && interest!==''){
                                userData.interests=[...userData.interests,interest]
                              setUserData({...userData})
                              setInterest('')}
                            }}
                            > <b>+</b></div></div>

                        </div>
                    </div>
                </div>
                <div className='d-flex mb-5 w-100 ms-3 '>
                    <button className="btn btn-warning" style={{ height: '50px' }} onClick={_=>navigator('/profile/change-password')}>change password</button>
                    <button className="btn btn-danger ms-auto me-2" style={{ height: '50px', width: '110px' }} onClick={e=>{setUserData({...initialData})}}>reset</button>
                    <button className="btn btn-success me-3" style={{ height: '50px', width: '110px' }} onClick={submitHandler}>{spinner? <span class="spinner-border" aria-hidden="true"></span>:'save'}</button>
                </div>
            </div>
        </div>
    )
}

export default EditProfile
