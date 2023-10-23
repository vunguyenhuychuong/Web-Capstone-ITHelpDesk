import { MdQueryStats } from 'react-icons/md';
import { FaAd, FaTicketAlt, FaWpforms } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import { Category, DesignServices, Menu, Mode } from '@mui/icons-material';

const links = [
  { id: 1, text: 'service', path: 'service', icon: <DesignServices /> },
  { id: 2, text: 'team', path: 'team', icon: <MdQueryStats /> },
  { id: 3, text: 'mode', path: 'mode', icon: <Mode /> },
  { id: 4, text: 'profile', path: 'profile', icon: <ImProfile /> },
  { id: 5, text: 'customer', path: 'customer', icon: <ImProfile />},
  { id: 6, text: 'main', path: 'main', icon : <FaAd />},
  { id: 7, text: 'mains', path: 'mains', icon : <FaWpforms />},
  { id: 8, text: 'menu', path: 'menu', icon: <Menu />},
  { id: 9, text: 'categories', path: 'categories', icon: <Category />},
  { id: 10, text: 'listTicket', path: 'listTicket', icon: <FaTicketAlt />},
  { id: 11, text: 'customerTicket', path: 'customerTicket', icon: <FaTicketAlt />},
  { id: 12, text: 'detailTicket', path: 'detailTicket', icon: <FaTicketAlt />}
];

export default links;
