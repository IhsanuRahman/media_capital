import React, { useEffect } from 'react'
import Header from '../../../componets/admin/Header'
import { useDispatch, useSelector } from 'react-redux';
import { json, useNavigate } from 'react-router-dom';
import { logout } from '../../../features/user';

function AdminHome() {
  const navigate = useNavigate()
  const dispatch =useDispatch()
  const { isAuthenticated, user, loading } = useSelector(state => state.user);
  useEffect(() => {
    if (!isAuthenticated && !loading && Object.keys(user).length === 0) {
        console.log('loading', loading,user)
        return navigate('/admin/login')
    }else if (!loading && user.is_staff===false){
      return navigate('/admin/login')

    }
})
  return (

    user.is_staff===true?<div className='bg-main text-dark d-flex justify-content-center align-items-center' style={{ height: '100%', weight: '100%' }}>
            <Header 
            trailing={
              <button className='btn btn-danger '
               onClick={e=>{

                dispatch(logout())
                navigate('/admin/login')
               }}
              >logout</button>
            }
            />
            
        </div>:<div></div>
  )
}

export default AdminHome
