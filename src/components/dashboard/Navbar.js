import Wrapper from '../../assets/wrappers/Navbar';
import { FaAlignLeft, FaUserCircle, FaCaretDown, FaSignOutAlt } from 'react-icons/fa';
import Logo from './Logo';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import { ExitToApp, Settings } from '@mui/icons-material';

const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('profile');
    sessionStorage.removeItem('profile');
    localStorage.clear();
    setShowLogout(true);
    toast.success("Log out successful");
    navigate('/');
  };

  return (
    <Wrapper>
      <div className='nav-center'>
        <button type='button' className='toggle-btn'>
          <FaAlignLeft />
        </button>
        <div>
          <Logo />
        </div>
        <div className='btn-container'>
          <button
            type='button'
            className='btn'
            onClick={() => setShowLogout(!showLogout)}
          >
            <FaUserCircle />
            <FaCaretDown />
          </button>
          <div className={showLogout ? 'dropdown show-dropdown' : 'dropdown'}>
            <button
              type='button'
              className='dropdown-btn'
              onClickCapture={logout}
            >
              <ExitToApp />
            </button>
            <hr />
            <button
              type='button'
              className='dropdown-btn'
            >
              <Settings />
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
export default Navbar;
