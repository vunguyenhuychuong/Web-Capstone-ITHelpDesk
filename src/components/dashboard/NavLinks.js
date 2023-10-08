import { NavLink } from 'react-router-dom';
import links from '../../utils/links';
import { useSelector } from 'react-redux';


const NavLinks = ({ toggleSidebar }) => {
  const user = useSelector((state) => state.auth);
  const roleUser = user.user.role;
  let filteredLink = [];

  if(roleUser === 1) {
    filteredLink = links.filter(link => link.id === 1 || link.id === 4 || link.id === 7);
  }else if(roleUser === 0) {
    filteredLink = links.filter(link => link.id === 2 || link.id === 3 || link.id === 5 || link.id === 4 || link.id === 6);
  }

  return (
    <div className='nav-links'>
      {filteredLink.map((link) => {
        const { text, path, id, icon } = link;
        return (
          <NavLink
            to={path}
            className={({ isActive }) => {
              return isActive ? 'nav-link active' : 'nav-link';
            }}
            key={id}
            onClick={toggleSidebar}
            end
          >
            <span className='icon'>{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};
export default NavLinks;
