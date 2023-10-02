import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing, Error, Login} from './pages';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Profile,
  AddJob,
  AllJobs,
  Stats,
  SharedLayout,
} from './pages/dashboard';
import ForgetPassword from './pages/ForgetPassword';
import Customer from './pages/dashboard/Customer';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";

function App() {
  const user = useSelector((state) => state.auth);

  const hasCustomerRole = user?.user?.role === 1;
  const hasAdminRole = user?.user?.role === 0;
  // console.log(user.user.role);
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<Landing />} />
        <Route
          path='/home'
          element={
            <SharedLayout />  
          }
        >
          <Route index element={<Stats />} />
          <Route path='all-jobs' element={<AllJobs />} />
          <Route path='add-job' element={<AddJob />} />
          {(hasCustomerRole || hasAdminRole) && <Route path='profile' element={<Profile />} />} 
          {hasAdminRole && <Route path='customer' element={<Customer />} />} 
          </Route>
        <Route path='login' element={<Login />} />
        <Route path='forgot-password' element={<ForgetPassword /> }  />
        <Route path='*' element={<Error />} />
      </Routes>
      <ToastContainer position='top-center' />
    </BrowserRouter>
  );
}

export default App;
