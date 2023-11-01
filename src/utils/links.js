import { FaAd, FaLightbulb, FaTicketAlt, FaWpforms } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import {
  Category,
  ControlPoint,
  DesignServices,
  Details,
  FolderShared,
  Group,
  Menu,
  ModeComment,
} from "@mui/icons-material";

const links = [
  { id: 1, text: "service", path: "service", icon: <DesignServices /> },
  { id: 2, text: "team", path: "team", icon: <Group /> },
  { id: 3, text: "mode", path: "mode", icon: <ModeComment /> },
  { id: 4, text: "profile", path: "profile", icon: <ImProfile /> },
  { id: 5, text: "customer", path: "customer", icon: <FolderShared /> },
  { id: 6, text: "main", path: "main", icon: <FaAd /> },
  { id: 7, text: "mains", path: "mains", icon: <FaWpforms /> },
  { id: 8, text: "menu", path: "menu", icon: <Menu /> },
  { id: 9, text: "categories", path: "categories", icon: <Category /> },
  { id: 10, text: "List Ticket", path: "listTicket", icon: <FaTicketAlt /> },
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
    text: "Create Solution",
    path: "createSolution",
    icon: <ControlPoint />,
  },
  {
    id: 15,
    text: "Detail Solution",
    path: "detailTicketSolution",
    icon: <Details />,
  },
];

export default links;
