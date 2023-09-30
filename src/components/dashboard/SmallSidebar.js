import Wrapper from '../../assets/wrappers/SmallSidebar';
import { FaTimes } from 'react-icons/fa';
//import Logo from './Logo';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../../features/user/userSlice';
import NavLinks from './NavLinks';
const SmallSidebar = () => {
  const dispatch = useDispatch();

  const toggle = () => {
    dispatch(toggleSidebar());
  };
  return (
    <Wrapper>
      <div
        className={
          'sidebar-container show-sidebar' 
        }
      >
        <div className='content'>
          <button className='close-btn' onClick={toggle}>
            <FaTimes />
          </button>
          <header>
            {/* <Logo /> */}
          </header>
          <NavLinks toggleSidebar={toggle} />
        </div>
      </div>
    </Wrapper>
  );
};
export default SmallSidebar;
