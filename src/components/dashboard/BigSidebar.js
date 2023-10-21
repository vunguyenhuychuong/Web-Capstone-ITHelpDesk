import NavLinks from './NavLinks';
import '../../assets/css/Logo.css'
import Wrapper from '../../assets/wrappers/BigSidebar';
import Logo from './Logo';

const BigSidebar = () => {
  return (
    <Wrapper>
      <div
        className={
          'sidebar-container show-sidebar'
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
