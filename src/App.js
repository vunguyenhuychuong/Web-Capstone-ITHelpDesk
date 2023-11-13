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
import TicketSolutionList from './pages/dashboard/Technician/TicketSolutionList';
import CreateTicketSolution from './pages/dashboard/Technician/CreateTicketSolution';
import TicketSolutionDetail from './pages/dashboard/Technician/TicketSolutionDetail';
import EditTicketSolution from './pages/dashboard/Technician/EditTicketSolution';
import HomeTechnician from './pages/dashboard/Technician/HomeTechnician';
import TicketTaskList from './pages/dashboard/Technician/TicketTaskList';
import CreateTicketTask from './pages/dashboard/Technician/CreateTicketTask';
import CreateTickets from './pages/dashboard/Manager/CreateTickets';
import EditTickets from './pages/dashboard/Manager/EditTickets';
import EditTicketTask from './pages/dashboard/Technician/EditTicketTask';
import ChartManager from './pages/dashboard/Chart/ChartManager';
import CompanyList from './pages/dashboard/Company/CompanyList';
import CreateCompany from './pages/dashboard/Company/CreateCompany';
import EditCompany from './pages/dashboard/Company/EditCompany';
import CustomizedSteppers from './pages/dashboard/Customer/CustomizedSteppers';
import RequestIssue from './pages/dashboard/Customer/RequestIssue';
import CreateTicketTaskTc from './pages/dashboard/Technician/CreateTicketTaskTc';
import MyRequestList from './pages/dashboard/Customer/MyRequestList';

function App() {
  const data = JSON.parse(sessionStorage.getItem("profile"));
  const user = useSelector((state) => state.auth);
  const hasCustomerRole = user?.user?.role === 1 || data?.result?.role === 1;
  const hasAdminRole = user?.user?.role === 0 || data?.result?.role === 0;
  const hasManagerRole = user?.user?.role === 2 || data?.result?.role === 2;
  const hasTechnicianRole = user?.user?.role === 3 || data?.result?.role === 3;
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
          {(hasCustomerRole || hasAdminRole || hasManagerRole || hasTechnicianRole) && <Route path='profile' element={<Profile />} />} 
          {hasAdminRole && <Route path='customer' element={<Customer />} />}
          {(hasCustomerRole) && <Route path='mains' element={<HomeCustomer />} />} 
          <Route path='main' element={<AccessibleTabs1 />} />
          <Route path='menu' element={<Menu />} />
          {(hasCustomerRole || hasManagerRole) && <Route path='service' element={<ServiceList />} />}
          <Route path='mode' element={<ModeList />} />
          <Route path='customerTicket' element={<IssueList />} />
          <Route path='ticketService/:ticketId' element={<TicketService />} />
          <Route path='createTicket' element={<CreateTickets />} />
          <Route path='editTicket/:ticketId' element={<EditTickets />} />
          <Route path='ticketSolution' element={<TicketSolutionList />} />
          <Route path='createSolution' element={<CreateTicketSolution />} />
          <Route path='editSolution/:solutionId' element={<EditTicketSolution />} />
          <Route path='detailSolution/:solutionId' element={<TicketSolutionDetail />} />
          <Route path='detailTicket/:ticketId' element={<DetailTicket />} />
          <Route path='homeTechnician' element={<HomeTechnician />} />
          <Route path='ticketTask' element={<TicketTaskList />} />
          <Route path='createTask/:ticketId' element={<CreateTicketTask />} />
          <Route path='createTask' element={<CreateTicketTaskTc />} />
          <Route path='editTask/:ticketId' element={<EditTicketTask />} />
          <Route path='dashBoard' element={<ChartManager />} />
          <Route path='companyList' element={<CompanyList />} />
          <Route path='createCompany' element={<CreateCompany />} />
          <Route path='editCompany/:companyId' element={<EditCompany />} />
          <Route path='stepperCustomer' element={<CustomizedSteppers />} />
          <Route path='createRequest' element={<RequestIssue />} />
          <Route path='requestCustomerList' element={<MyRequestList />} />
          {(hasManagerRole || hasTechnicianRole) && <Route path='listTicket' element={<ManagersTabs />} />}
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
