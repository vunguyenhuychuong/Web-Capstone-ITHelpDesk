import NavLinks from './NavLinks';
import '../../assets/css/Logo.css'
import Wrapper from '../../assets/wrappers/BigSidebar';
import Logo from './Logo';
import { useSelector } from 'react-redux';

const BigSidebar = () => {
  const { isSidebarOpen } = useSelector((store) => store.auth);

  return (
    <Wrapper>
      <div
         className={
          isSidebarOpen
            ? 'sidebar-container '
            : 'sidebar-container show-sidebar'
        }
      >
        <div className='content'>
          <header>
             <Logo />
          </header>
        </div>
        <NavLinks />
      </div>
    </Wrapper>
  );
};
export default BigSidebar;
