import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { Landing, Error, Login} from './pages';
import 'react-toastify/dist/ReactToastify.css';
import './assets/css/toast.css'
import {
  Profile,
  SharedLayout,
} from './pages/dashboard';
import ForgetPassword from './pages/ForgetPassword';
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
import HomeManager from './pages/dashboard/Manager/HomeManager';
import HomeAdmin from './pages/dashboard/Admin/HomeAdmin';
import ContractList from './pages/dashboard/Contract/ContractList';
import CreateContract from './pages/dashboard/Contract/CreateContract';
import HomeAccountant from './pages/dashboard/Accountant/HomeAccountant';
import IndexTicket from './pages/dashboard/Manager/IndexTicket';
import { ToastContainer } from 'react-toastify';
import PaymentList from './pages/dashboard/Payment/PaymentList';
import CreatePayment from './pages/dashboard/Payment/CreatePayment';
import EditPayment from './pages/dashboard/Payment/EditPayment';
import EditContract from './pages/dashboard/Contract/EditContract';
import TicketLogList from './pages/dashboard/Customer/TicketLogList';
import TeamMemberList from './pages/dashboard/TeamMember/TeamMemberList';
import CreateTeamMember from './pages/dashboard/TeamMember/CreateTeamMember';
import EditTeamMember from './pages/dashboard/TeamMember/EditTeamMember';
import EditTicketCustomer from './pages/dashboard/Manager/EditTicketCustomer';
import UserList from './pages/dashboard/User/UserList';
import CreateUser from './pages/dashboard/User/CreateUser';
import EditUser from './pages/dashboard/User/EditUser';
import DetailContract from './pages/dashboard/Manager/Contract/DetailContract';
import CreateRenewContract from './pages/dashboard/Manager/Contract/CreateRenewContract';

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
          {hasAdminRole && <Route path='userList' element={<UserList />} />}
          {hasAdminRole && <Route path='createUser' element={<CreateUser />} />}
          {hasAdminRole && <Route path='editUser/:userId' element={<EditUser />} />}
          {(hasCustomerRole) && <Route path='mains' element={<HomeCustomer />} />} 
          <Route path='main' element={<AccessibleTabs1 />} />
          <Route path='menu' element={<Menu />} />
          {(hasCustomerRole || hasManagerRole) && <Route path='service' element={<ServiceList />} />}
          <Route path='mode' element={<ModeList />} />
          <Route path='customerTicket' element={<IssueList />} />
          <Route path='ticketService/:ticketId' element={<TicketService />} />
          <Route path='createTicket' element={<CreateTickets />} />
          <Route path='editTicket/:ticketId' element={<EditTickets />} />
          <Route path='editTicketCustomer/:ticketId' element={<EditTicketCustomer />} />
          <Route path='ticketSolution' element={<TicketSolutionList />} />
          <Route path='createSolution' element={<CreateTicketSolution />} />
          <Route path='editSolution/:solutionId' element={<EditTicketSolution />} />
          <Route path='detailSolution/:solutionId' element={<TicketSolutionDetail />} />
          <Route path='detailTicket/:ticketId' element={<DetailTicket />} />
          {(hasTechnicianRole) &&<Route path='homeTechnician' element={<HomeTechnician />} />}
          <Route path='listTicket' element={<IndexTicket />} />
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
          {(hasManagerRole) &&<Route path='homeManager' element={<HomeManager />} />}
          {(hasAdminRole) &&<Route path='homeAdmin' element={<HomeAdmin />} />}
          <Route path='contractList' element={<ContractList />} />
          <Route path='createContract' element={<CreateContract />} />
          <Route path='createRenewContract/:contractId' element={<CreateRenewContract />} />
          <Route path='detailContract/:contractId' element={<DetailContract />} />
          <Route path='editContract/:contractId' element={<EditContract />} />
          <Route path='homeAccountant' element={<HomeAccountant />} />
          <Route path='paymentList' element={<PaymentList />} />
          <Route path='createPayment' element={<CreatePayment />} />
          <Route path='editPayment/:paymentId' element={<EditPayment />} />
          <Route path='ticketLog/:ticketId' element={<TicketLogList />} />
          <Route path='teamMember' element={<TeamMemberList />} />
          <Route path='createTeamMember' element={<CreateTeamMember />} />
          <Route path='editTeamMember/:teamMemberId' element={<EditTeamMember />} />
          </Route>
        <Route path='login' element={<Login />} />
        <Route path='forgot-password' element={<ForgetPassword /> }  />
        <Route path='unauthorize' element={<Unauthorize />} />
        <Route path='*' element={<Error  />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
