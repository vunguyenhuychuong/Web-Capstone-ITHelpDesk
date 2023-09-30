import NavLinks from './NavLinks';
//import Logo from '../components/Logo';
import Wrapper from '../../assets/wrappers/BigSidebar';

const BigSidebar = () => {
  return (
    <Wrapper>
      <div
        // className={
        //   isSidebarOpen
        //     ? 'sidebar-container '
        //     : 'sidebar-container show-sidebar'
        // }
        className={
          'sidebar-container show-sidebar'
        }
      >
        <div className='content'>
          <header>
            {/* <Logo /> */}
          </header>
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  );
};
export default BigSidebar;
