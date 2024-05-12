
import Signup from './pages/client/auth/Signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './App.css'
import Login from './pages/client/auth/Login';
import Home from './pages/client/home/Home';
import AdminLogin from './pages/admin/auth/Login';
import { useDispatch } from 'react-redux';
import { checkAuth } from './features/user'
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(dispatch(checkAuth()))
  }, []);
  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin/login' element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
