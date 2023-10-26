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
import ManagersTabs from './pages/dashboard/Manager/ManagerTabs';
import AccessibleTabs1 from './pages/dashboard/Customer/CustomerTabs';
import Menu from './pages/dashboard/Customer/Menu';
import IssueList from './pages/dashboard/Customer/IssueList';
import DetailTicket from './pages/dashboard/Manager/DetailTicket';
import Unauthorize from './pages/Unauthorize';
import ServiceList from './pages/dashboard/ServicePack/ServiceList';
import ModeList from './pages/dashboard/Mode/ModeList';
import Team from './pages/dashboard/Team/Team';
import HomeCustomer from './pages/dashboard/Customer/HomeCustomer';
import TicketService from './pages/dashboard/Customer/TicketService';

function App() {
  const data = JSON.parse(sessionStorage.getItem("profile"));
  const user = useSelector((state) => state.auth);
  const hasCustomerRole = user?.user?.role === 1 || data?.result?.role === 1;
  const hasAdminRole = user?.user?.role === 0 || data?.result?.role === 0;
  const hasManagerRole = user?.user?.role === 2 || data?.result?.role === 2;
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
          <Route index element={<AccessibleTabs1 />} />
          {(hasAdminRole || hasManagerRole) && <Route path='team' element={<Team />} />}
          {(hasCustomerRole || hasAdminRole || hasManagerRole) && <Route path='profile' element={<Profile />} />} 
          {hasAdminRole && <Route path='customer' element={<Customer />} />}
          {(hasCustomerRole) && <Route path='mains' element={<HomeCustomer />} />} 
          <Route path='main' element={<AccessibleTabs1 />} />
          <Route path='menu' element={<Menu />} />
          {(hasCustomerRole || hasManagerRole) && <Route path='service' element={<ServiceList />} />}
          <Route path='mode' element={<ModeList />} />
          <Route path='customerTicket' element={<IssueList />} />
          <Route path='ticketService/:ticketId' element={<TicketService />} />
          <Route path='detailTicket/:ticketId' element={<DetailTicket />} />
          {(hasManagerRole) && <Route path='listTicket' element={<ManagersTabs />} />}
          </Route>
        <Route path='login' element={<Login />} />
        <Route path='forgot-password' element={<ForgetPassword /> }  />
        <Route path='unauthorize' element={<Unauthorize />} />
        <Route path='*' element={<Error  />} />
      </Routes>
      <ToastContainer position='top-center' />
    </BrowserRouter>
  );
}

export default App;
