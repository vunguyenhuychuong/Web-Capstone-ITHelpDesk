import logoAvatar from "../../assets/images/icon.png";
import "../../assets/css/Logo.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const Logo = () => {
  const user = useSelector((state) => state.auth);
  const role = user.user.role;
  const navigate = useNavigate();
  const handleEnterLogo = () => {
    if (role === 0) {
      navigate("/home/homeAdmin");
    } else if (role === 1) {
      navigate("/home/mains");
    } else if (role === 2) {
      navigate("/home/homeManager");
    } else if (role === 3) {
      navigate("/home/homeTechnician");
    } else if (role === 4) {
      navigate("/home/homeAccountant");
    }
  };
  return (
    <div className="logo-container">
      <img
        src={logoAvatar}
        onClick={handleEnterLogo}
        className="logo shine-effect"
        alt=""
      />
    </div>
  );
};
export default Logo;
