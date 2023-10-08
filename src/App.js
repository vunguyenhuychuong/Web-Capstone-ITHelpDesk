import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { Landing, Error, Login} from './pages';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Profile,
  SharedLayout,
} from './pages/dashboard';
import ForgetPassword from './pages/ForgetPassword';
import Customer from './pages/dashboard/Customer';
import { useSelector } from 'react-redux';
import Tickets from './pages/dashboard/Ticket';
import Team from './pages/dashboard/Team';
import AccessibleTabs1 from './pages/dashboard/Customer/AccessibleTabs';
import Main from './pages/dashboard/Main';
import Menu from './pages/dashboard/Customer/Menu';
import ServiceCategories from './pages/dashboard/Customer/ServiceCategories';
import RequestIssues from './pages/dashboard/Customer/Issue';

function App() {
  const data = JSON.parse(sessionStorage.getItem("profile"));
  const user = useSelector((state) => state.auth);
  const hasCustomerRole = user?.user?.role === 1 || data?.result?.role === 1;
  const hasAdminRole = user?.user?.role === 0 || data?.result?.role === 0;
  console.log(hasCustomerRole);
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
          {/* <Route index element={<Stats />} /> */}
          {(hasAdminRole) && <Route path='team' element={<Team />} />}
          <Route path='ticket' element={<Tickets />} />
          {(hasCustomerRole || hasAdminRole) && <Route path='profile' element={<Profile />} />} 
          {hasAdminRole && <Route path='customer' element={<Customer />} />}
          {(hasCustomerRole) && <Route path='mains' element={<Main />} />} 
          <Route path='main' element={<AccessibleTabs1 />} />
          <Route path='menu' element={<Menu />} />
          {/* <Route path='issues' element={<RequestIssues />} /> */}
          <Route path='categories' element={<ServiceCategories />} />
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
