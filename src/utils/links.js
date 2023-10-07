import { IoBarChartSharp } from 'react-icons/io5';
import { MdQueryStats } from 'react-icons/md';
import { FaAd, FaWpforms } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';

const links = [
  { id: 1, text: 'stats', path: '/', icon: <IoBarChartSharp /> },
  { id: 2, text: 'team', path: 'team', icon: <MdQueryStats /> },
  { id: 3, text: 'ticket', path: 'ticket', icon: <FaWpforms /> },
  { id: 4, text: 'profile', path: 'profile', icon: <ImProfile /> },
  { id: 5, text: 'customer', path: 'customer', icon: <ImProfile />},
  { id: 6, text: 'main', path: 'main', icon : <FaAd />}
];

export default links;
