import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import Index from './pages/dashboard/Admin/Index';
import ForgetPassword from './pages/ForgetPassword';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route
          path='/'
          element={
            <SharedLayout />
          }
        >
          <Route index element={<Stats />} />
          <Route path='all-jobs' element={<AllJobs />} />
          <Route path='add-job' element={<AddJob />} />
          <Route path='profile' element={<Profile />} />
          <Route path='user' element={<Index />} />
        </Route>
        <Route path='landing' element={<Landing />} />
        <Route path='login' element={<Login />} />
        <Route path='forgot-password' element={<ForgetPassword /> }  />
        <Route path='*' element={<Error />} />
      </Routes>
      <ToastContainer position='top-center' />
    </BrowserRouter>
  );
}

export default App;
