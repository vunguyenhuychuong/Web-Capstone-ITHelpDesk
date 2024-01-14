import { FaAd, FaLightbulb, FaTicketAlt } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import {
  Assessment,
  Business,
  Category,
  CategoryOutlined,
  DesignServices,
  Details,
  FolderShared,
  Group,
  Home,
  IosShare,
  Menu,
  ModeComment,
  Payment,
  ReceiptLong,
} from "@mui/icons-material";

const links = [
  { id: 1, text: "service", path: "service", icon: <DesignServices /> },
  { id: 2, text: "team", path: "team", icon: <Group /> },
  { id: 3, text: "mode", path: "mode", icon: <ModeComment /> },
  { id: 4, text: "profile", path: "profile", icon: <ImProfile /> },
  { id: 5, text: "userList", path: "userList", icon: <FolderShared /> },
  { id: 6, text: "Home", path: "main", icon: <FaAd /> },
  { id: 7, text: "Home", path: "mains", icon: <Home /> },
  { id: 8, text: "menu", path: "menu", icon: <Menu /> },
  { id: 9, text: "categories", path: "categories", icon: <Category /> },
  { id: 17, text: "List Ticket", path: "listTicket", icon: <FaTicketAlt /> },
  {
    id: 11,
    text: "Customer Ticket",
    path: "customerTicket",
    icon: <FaTicketAlt />,
  },
  { id: 12, text: "detailTicket", path: "detailTicket", icon: <FaTicketAlt /> },
  {
    id: 13,
    text: "Tickets Solution",
    path: "ticketSolution",
    icon: <FaLightbulb />,
  },
  {
    id: 14,
    text: "List Task",
    path: "ticketTask",
    icon: <Details />,
  },
  {
    id: 15,
    text: "Detail Solution",
    path: "detailTicketSolution",
    icon: <Details />,
  },
  {
    id: 16,
    text: "Company",
    path: "companyList",
    icon: <Business />
  },
  {
    id: 10,
    text: "Home",
    path: "homeTechnician",
    icon: <Home />
  },
  {
    id: 18,
    text: "My Request list",
    path: "requestCustomerList",
    icon: <IosShare />
  },
  {
    id: 19,
    text: "Home Manager",
    path: "homeManager",
    icon: <Home />
  },
  {
    id: 20,
    text: "Home Admin",
    path: "homeAdmin",
    icon: <Home />
  },
  {
    id: 21,
    text: "Contract",
    path: "contractList",
    icon: <ReceiptLong />
  },
  {
    id: 22,
    text: "Home Accountant",
    path: "homeAccountant",
    icon: <Home />
  },
  {
    id: 23,
    text: "Payment",
    path: "paymentList",
    icon: <Payment />
  },
  {
    id: 24,
    text: "Ticket Assign",
    path: "ticketAssign",
    icon: <Assessment />
  },
  {
    id: 28,
    text: "Company Member",
    path: "companyMember",
    icon: <Assessment />
  },
  {
    id: 29,
    text: "Category",
    path: "categoryList",
    icon: <CategoryOutlined />
  },
];

const additionalLinks = [
  { id: 25, text: "Create Page", path: "createPage", icon: <Payment /> },
  { id: 26, text: "Update Page", path: "paymentList", icon: <Assessment /> },
  { id: 27, text: "Custom Company", path: "ticketAssign", icon: <Business /> },
];

export { links, additionalLinks };
