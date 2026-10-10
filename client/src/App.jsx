import {BrowserRouter, Routes, Route} from 'react-router-dom';
import About from './assets/pages/About';
import Home from './assets/pages/Home';
import Profile from './assets/pages/Profile';
import SignIn from './assets/pages/SignIn';
import SignUp from './assets/pages/SignUp';
import Header from './components/Header';
import PrivateRoutes from './components/PrivateRoutes';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing.jsx';
import Listing from './pages/Listing.jsx';
import Search from './pages/Search.jsx';

export default function App() {
  return <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/about' element={<About/>} />
      <Route path="/listing/:listingId" element={<Listing />} />
      <Route path="/search" element={<Search />} />
      <Route element={<PrivateRoutes/>}>
        <Route path='/profile' element={<Profile/>}/>
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/update-listing/:listingId" element={<UpdateListing />} />
      </Route>
      <Route path='/sign-in' element={<SignIn/>} />
      <Route path='/sign-up' element={<SignUp/>} />
    </Routes>
  </BrowserRouter>
}