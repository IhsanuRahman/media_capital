import React, { useEffect, useReducer, useRef, useState } from 'react'
import Header from '../../../componets/client/Header'
import three_dots from '../../../assets/three_dots.svg'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../../constants';
import Posts from '../../../componets/client/Posts';
import api from '../../../axios';
import SupportersList from '../../../componets/client/SupportersList';
import GridPosts from '../../../componets/client/GridPosts';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';



function Profile() {
  const { isAuthenticated, user, loading } = useSelector(state => state.user);
  const navigator = useNavigate()
  const [tab, setTab] = useState(0)
  const [saved_posts, setSaved] = useState([])
  const [own_posts, setOwn] = useState([])
  const [supporters,setSupporters]=useState(user.supporters?[...user.supporters]:[])
  const [supportings,setSupportings]=useState(user.supportings?[...user.supportings]:[])
  
  useEffect(() => {
    api.get('/posts/saved', { headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` } }).then(e => {
    
      setSaved(e.data.posts)

    })
    api.get('/posts/own', { headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` } }).then(e => {
     
      setOwn(e.data.posts)
    })

  }, [])
  return (
    Object.keys(user).length > 0 ? 
    <div className='w-100 h-100 overflow-y-scroll hidescroller' style={{ minHeight: '100%', maxWidth: '100%' }} >
      <Header />
      <div className="w-100 bg-white h-25" style={{ backgroundImage: `${user.banner !== null && `url(${baseUrl + user.banner})`}` }}>

      </div>
      <div className='w-100   border-bottom border-1 d-flex row' >
        <div className="align-items-center d-flex flex-column ps-5" style={{ width: '200px' }}>
          <div className=' rounded-circle   bg-secondary  ' style={{ height: '150px', minWidth: '150px ', backgroundSize: 'cover', marginTop: '-50px', backgroundImage: `url(${baseUrl + user.profile})` }}  >
          </div>
        </div>
        <div className=' w-max'  >
          <div className=" d-flex flex-column    pt-3">
            <div className='d-flex w-100'>
              <h4 className='ms-2  '>{user.username}</h4>
              <div className="d-flex  col-3 ms-3 ms-auto    w-auto ps-auto"  >
                <button className="btn d-none  d-sm-block btn-success me-2" onClick={_ => navigator('/create-post')}>add post</button>
                <button className="btn d-none  d-sm-block btn-warning" onClick={_ => navigator('/profile/edit')}>edit profile</button>
                <div className="dropdown ms-auto me-1 d-block d-sm-none" data-bs-theme="dark" >
                                    

                                    <MoreHorizIcon height={30} style={{ cursor: 'pointer' }} className="ms-4 dropdown-toggle" data-bs-toggle="dropdown" aria-expanded='false'  />
                                    <ul className="dropdown-menu dropdown-center "  >
                                        <li className="dropdown-item cursor-pointer" onClick={_ => navigator('/create-post')} >add post</li>
                                        <li className="dropdown-item cursor-pointer"  onClick={_ => navigator('/profile/edit')}>edit profile</li>
                                    </ul>
                                </div>
              </div>
            </div>
            <p className='ms-4  text-custom-grey '>{user.first_name} {user.last_name}</p>
            
          </div>
        </div>
        <div className=' justify-content-around  gap-2 d-flex'>
              <div className=" d-sm-flex fw-light "> <p className='me-1 fw-normal text-center   mb-0'>{own_posts.length}</p> posts</div>
              <div className=" d-sm-flex fw-light cursor-pointer"  data-bs-toggle="modal" data-bs-target={`#SupportingsBackdrop`}><p className='me-1 fw-normal text-center mb-0 '>{supportings?.length}</p>supportings</div>
              <div className="  d-sm-flex fw-light cursor-pointer " data-bs-toggle="modal" data-bs-target={`#SupportersBackdrop`}><p className='me-1 fw-normal  text-center mb-0'>{supporters?.length}</p>supporters</div>
             
            </div>
        <div className='w-100 ms-5 mt-2'>
          <p className=' text-custom-grey'>{user.description}</p>
        </div>
      </div>
      <div className='w-100 d-flex  justify-content-center pt-2'>
        <div className='d-flex' style={{ width: '300px', height: '40px' }}>
          <button className={`border-0 w-50 tab-btn-secondary border-end border-secondary rounded-start text-white bg-secondary bg-opacity-${tab == 0 ? '50' : '25'}`}
            onClick={e => {
              if (tab !== 0) {
                setTab(0)
              }
            }}
          >my posts</button>
          <button className={`border-0 w-50 tab-btn-secondary rounded-end  text-white bg-secondary bg-opacity-${tab == 1 ? '50' : '25'}`}
            onClick={e => {
              if (tab !== 1) {
                setTab(1)
              }
            }}>saved</button>
        </div>

      </div>

      {tab === 0 ?
        <GridPosts posts={own_posts} clearHeight={400}/> :
        <GridPosts posts={saved_posts}  clearHeight={400}/>
      } <SupportersList list={supporters} setList={setSupporters} type='Supporters' />
              <SupportersList list={supportings} setList={setSupportings} type='Supportings' />
    </div>:null
  )
}

export default Profile
