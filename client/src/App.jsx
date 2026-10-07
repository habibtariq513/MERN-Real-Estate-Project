import {BrowserRouter, Routes, Route} from 'react-router-dom';
import About from './assets/pages/About';
import Home from './assets/pages/Home';
import Profile from './assets/pages/Profile';
import SignIn from './assets/pages/SignIn';
import SignUp from './assets/pages/SignUp';
import Header from './components/Header';
import PrivateRoutes from './components/PrivateRoutes';
import CreateListing from './pages/CreateListing';

export default function App() {
  return <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/about' element={<About/>} />
      <Route element={<PrivateRoutes/>}>
        <Route path='/profile' element={<Profile/>}/>
        <Route path="/create-listing" element={<CreateListing />} />
      </Route>
      <Route path='/sign-in' element={<SignIn/>} />
      <Route path='/sign-up' element={<SignUp/>} />
    </Routes>
  </BrowserRouter>
}