import React, {  useEffect, useState } from 'react'
import Header from '../../../componets/admin/Header'
import { useDispatch, useSelector } from 'react-redux';
import {  json, useNavigate, useSearchParams } from 'react-router-dom';
import { logout } from '../../../features/user';
import LogoutIcon from '@mui/icons-material/Logout';
import Users from '../../../componets/admin/Users';
import Posts from '../../../componets/admin/Posts';
import Reports from '../../../componets/admin/Reports';
import Notifications from '../../../componets/admin/Notifications';
import Tags from '../../../componets/admin/Tags';
import Comments from '../../../componets/admin/Comments';


function AdminHome() {
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {  user } = useSelector(state => state.user);
  const [tab, setTab] = useState(Number(searchParams.get('tab',0)))
  useEffect(()=>{
    searchParams.set('tab',tab)
    setSearchParams(searchParams)
  },[tab])
  
  const Tab=({idx,name})=>{return (<tr className=' cursor-pointer'><td className={tab===idx?'rounded bg-primary text-white':'bg-transparent'}  
    onClick={_=>{
      tab!==idx&&setTab(idx)
      

    }}
  >{name}</td></tr>)}
  const Tabs=[<Users/>,<Posts/>,<Tags/>,<Reports/>,<Notifications/>,<Comments/>]
  return (

    user.is_staff === true ? <div className='bg-main text-dark d-flex justify-content-center align-items-center' style={{ height: '100%', weight: '100%' }}>
      <Header/>
      <div className='row h-100 d-flex w-100' style={{ paddingTop: '50px' }}>
        <div className="col-2 border-end border-dark h-100 d-flex flex-column">
          <table className='table table-hover mt-5 bg-transparent text-center fw-bold'>
            <tbody>
              
             <Tab idx={0} name={'user '}/>
             <Tab idx={1} name={'posts '}/>
             <Tab idx={2} name={'tags '}/>
             <Tab idx={3} name={'reports '}/>
             <Tab idx={4} name={'notifications '}/>
             <Tab idx={5} name={'comments '}/>
                  
            </tbody>
          </table>
          <button className='btn text-danger fw-bolder border-start-0 w-100  mt-auto mb-5 border-end-0 rounded-0 border-dark border-2 '
            onClick={e => {
              dispatch(logout())
              navigate('/admin/login')
            }}
          > <LogoutIcon />  logout</button>


        </div>
        <div className="col pe-0 overflow-hidden h-100">
            {Tabs[tab]}
        </div>
      </div>

    </div> : <div></div>
  )
}

export default AdminHome
