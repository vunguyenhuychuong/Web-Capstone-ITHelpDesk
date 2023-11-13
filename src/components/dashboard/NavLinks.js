import { NavLink } from "react-router-dom";
import links from "../../utils/links";
import { useSelector } from "react-redux";
import { useState } from "react";

const NavLinks = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState({});
  const user = useSelector((state) => state.auth);
  const roleUser = user.user.role;
  let filteredLink = [];

  if (roleUser === 1) {
    filteredLink = links.filter(
      (link) =>
        link.id === 4 || link.id === 7 || link.id === 11 || link.id === 13
    );
  } else if (roleUser === 0) {
    filteredLink = links.filter(
      (link) =>
        link.id === 2 ||
        link.id === 3 ||
        link.id === 5 ||
        link.id === 4 ||
        link.id === 6 
        
    );
  } else if (roleUser === 2) {
    filteredLink = links.filter(
      (link) =>
        link.id === 10 || link.id === 1 || link.id === 3 || link.id === 2  || link.id === 13 || link.id === 16
    );
  } else if (roleUser === 3) {
    filteredLink = links.filter(
      (link) => 
      link.id === 17 || link.id === 13  || link.id === 10 
    );
  }

  return (
    <div className="nav-links">
      {filteredLink.map((link) => {
        const { text, path, id, icon, dropdownLinks } = link;
        return (
          <div key={id} className="nav-link-wrapper">
            {dropdownLinks ? (
              <div
                className="nav-link"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="icon">{icon}</span>
                {text}
              </div>
            ) : (
              <NavLink
                to={path}
                className={({ isActive }) => {
                  return isActive ? "nav-link active" : "nav-link";
                }}
                key={id}
                onClick={toggleSidebar}
                end
              >
                <span className="icon">{icon}</span>
                {text}
              </NavLink>
            )}
            {isDropdownOpen && dropdownLinks && (
              <div className="dropdown-menu">
                {dropdownLinks.map((dropdownLink) => (
                  <NavLink
                    key={dropdownLink.id}
                    to={dropdownLink.path}
                    className="dropdown-link"
                    onClick={toggleSidebar}
                    end
                  >
                    {dropdownLink.text}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default NavLinks;
