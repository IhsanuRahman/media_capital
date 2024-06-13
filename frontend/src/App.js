
import Signup from './pages/client/auth/Signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './App.css'
import Login from './pages/client/auth/Login';
import Home from './pages/client/home/Home';
import AdminLogin from './pages/admin/auth/Login';
import AdminHome from './pages/admin/dashboard/Home';
import { useDispatch } from 'react-redux';
import { checkAuth, getUser } from './features/user'
import { useEffect } from 'react';
import OTPPage from './pages/client/auth/otp';
import ForgotPassword from './pages/client/auth/ForgotPassword';
import ChangePassword from './pages/client/profile/ChangePassword';
import ForgotChangePassword from './pages/client/auth/ChangePassword';
import ProtectedRoute from './PrivateRoute'
import Profile from './pages/client/profile/Profile';
import EditProfile from './pages/client/profile/EditProfile';
import CreatePosts from './pages/client/posts/CreatePosts';
import ViewPost from './pages/client/posts/ViewPost';
import AdminViewPost from './pages/admin/posts/ViewPost';
import ViewUser from './pages/client/profile/ViewUser';
import EditEmail from './pages/client/profile/EditEmail';
import CreateUser from './pages/admin/user/CreateUser';
import EditUser from './pages/admin/user/EditUser';
import AdminProtectedRoute from './AdminProtectedRoute';
import CreateNotification from './pages/admin/notifications/CreateNotifications';
function App() {
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(checkAuth())
  },[]);
  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/verify-email' element={<OTPPage  isAuth={false} apiUrl={'/otp/send'} redirection={'/login'} keyName={'RToken'} resendUrl={'/otp/resend'} />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/forgotpassword/verify-email' element={<OTPPage isAuth={false} apiUrl={'forgot-password/verify'} redirection={'/forgotpassword/change-password'} resendUrl={'/forgot-password/verify-resend'} keyName={'FStoken'} success={
          e => {
            console.log('token', e.data.token)
            localStorage.setItem('FStoken', e.data.token)
          }
        } />} />
        <Route path='/forgotpassword/change-password' element={<ForgotChangePassword />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/profile/edit" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />
        <Route path="/create-post" element={
          <ProtectedRoute>
            <CreatePosts />
          </ProtectedRoute>
        } />
        <Route path="/profile/change-password" element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        } />
        <Route path="/profile/change-email" element={
          <ProtectedRoute>
            <EditEmail />
          </ProtectedRoute>
        } />
        <Route path="/profile/change-email/verify" element={
          <ProtectedRoute>
            <OTPPage apiUrl={'profile/edit-email/verify'} redirection={'/profile'} keyName={'EEToken'} 
            success={_=>{
              dispatch(getUser())
            }}
            isAuth={true}  resendUrl={'/profile/edit-email/resend'}/>
          </ProtectedRoute>
        } />
        <Route path="/post/:id" element={
          <ProtectedRoute>
            <ViewPost />
          </ProtectedRoute>
        } />
        <Route path="/user/:id" element={
          <ProtectedRoute>
            <ViewUser />
          </ProtectedRoute>
        } />
        <Route path='/login' element={<Login />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin' element={
          <AdminProtectedRoute>
          <AdminHome />
          </AdminProtectedRoute>} />
        <Route path='/admin/user/create' element={
          <AdminProtectedRoute>
          <CreateUser /></AdminProtectedRoute>} />
        <Route path='/admin/user/:id' element={
           <AdminProtectedRoute>
          <EditUser /></AdminProtectedRoute>} />
          <Route path='/admin/post/:id' element={
           <AdminProtectedRoute>
          <AdminViewPost /></AdminProtectedRoute>} />
        <Route path='/admin/notification/create' element={
          <AdminProtectedRoute>
          <CreateNotification /></AdminProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
