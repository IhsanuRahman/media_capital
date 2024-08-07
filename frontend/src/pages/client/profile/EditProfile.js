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
    const {  user } = useSelector(state => state.user);
    const dispatch = useDispatch()
    const navigator =useNavigate()
    const [interest, setInterest] = useState('')
    const initialData={
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        dob: user.dob,
        banner:`${baseUrl+user.banner}`,
        interests:user.interests,
        description: user.description,
        profile: `${baseUrl+user.profile}`
    }
    const [userData, setUserData] = useState({
        ...initialData
    })
    const [errors, setErrors] = useState({
        username: '',
        first_name: '',
        last_name: '',
        dob: '',
        password: '',
        confirm_password: ''
    })
    const submitHandler = () => {
        if (JSON.stringify(initialData)===JSON.stringify(userData)){
            return navigator('/profile')
        }
        setSpinner(true)
        if (ProfileValidator(errors, userData)) {
            let form_data = new FormData();
            if (typeof userData.profile !== 'string') {
                form_data.append("profile", userData.profile, userData.profile.name);
            }
            form_data.append("username", userData.username);
            form_data.append("first_name", userData.first_name);
            form_data.append("last_name", userData.last_name);
            if (typeof userData.banner!=='string' && userData.banner!==null)
                form_data.append('banner', userData.banner)
            if (typeof userData.profile!=='string' && userData.profile!==null)
                form_data.append('profile', userData.profile)
            form_data.append('interests', JSON.stringify(userData.interests))
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
                try{
                    const serverErrors = e.response.data.message
                    setErrors({ ...errors, ...serverErrors })
                }catch{
                    setSpinner(false)
                    
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
            <div className=' rounded-circle d-flex flex-column d-block d-md-none   bg-secondary  ' style={{ cursor: 'pointer', height: '150px', width: '150px ', backgroundSize: 'cover', marginTop: '-50px', backgroundImage: `url(${typeof userData.profile === 'string' ? userData.profile : URL.createObjectURL(userData.profile)})` }}  >
                        <input type="file" accept=".jpg,.jpeg,.svg,.avif,.gif,.png" name="" id="" placeholder='' className='w-100 h-100 mt-auto m-0  rounded-circle  file-input ' style={{ cursor: 'pointer', color: 'transparent' }}
                            onChange={(e) => {
                                setUserData({ ...userData, profile: e.target.files[0] })
                            }}
                        />

                    </div>
            <div className='w-100 h-75  d-flex row ' >
                <div className="align-items-center d-flex d-none d-md-block  flex-column ps-5 hover-change " style={{ width: '200px' }}>
                    <div className=' rounded-circle d-flex flex-column d-none d-md-block   bg-secondary  ' style={{ cursor: 'pointer', height: '150px', minWidth: '150px ', backgroundSize: 'cover', marginTop: '-50px', backgroundImage: `url(${typeof userData.profile === 'string' ? userData.profile : URL.createObjectURL(userData.profile)})` }}  >
                        <input type="file" accept=".jpg,.jpeg,.svg,.avif,.gif,.png" name="" id="" placeholder='' className='w-100 h-100 mt-auto m-0  rounded-circle  file-input ' style={{ cursor: 'pointer', color: 'transparent' }}
                            onChange={(e) => {
                                setUserData({ ...userData, profile: e.target.files[0] })
                            }}
                        />

                    </div>
                </div>
                <div className='mx-md-0 mx-auto w-max-edit d-flex flex-md-row flex-column'>
                    <div className='d-flex gap-3  flex-column  p-5 col-md-9 col-12'>
                        
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
                        <input type="email" readonly value={user.email} className='form-control bg-black text-white whiteholder' placeholder='username' style={{ height: '35px', Top: '45px' }}
                            onChange={(e) => {
                               
                            }}
                        />
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
                    <div className=" p-3 col-10 col-md-3 mx-auto">
                        <div className='border border-white rounded  p-4 w-100'>
                            <h4 className='mb-3'>Interests</h4>
                            <div className='row clearfix gap-3 '>

                               {userData?.interests?.map((intreset,i)=> <div key={i} className='rounded-5 col d-flex align-items-center ps-1 border-white border  p-1 text-center' >
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
                                placeholder="add interests" id="" className='w-75 bg-black text-white border-0' />
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
                    <button className="btn btn-danger ms-2 me-2" style={{ height: '50px', width: '110px' }} onClick={e=>{navigator('/profile/change-email')}}>edit email</button>
                    <button className="btn btn-success ms-auto me-3" style={{ height: '50px', width: '110px' }} onClick={submitHandler}>{spinner? <span className="spinner-border" aria-hidden="true"></span>:JSON.stringify(initialData)===JSON.stringify(userData)?'back':'save'}</button>
                </div>
            </div>
        </div>
    )
}

export default EditProfile
