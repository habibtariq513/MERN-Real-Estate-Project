import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import About from './assets/pages/About';
import Home from './assets/pages/Home';
import Profile from './assets/pages/Profile';
import SignIn from './assets/pages/SignIn';
import SignUp from './assets/pages/SignUp';

export default function App() {
  return <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/about' element={<About/>} />
      <Route path='/profile' element={<Profile/>} />
      <Route path='/sign-in' element={<SignIn/>} />
      <Route path='/sign-up' element={<SignUp/>} />
    </Routes>
  </BrowserRouter>
}