import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((store) => store.user);
  console.log(user);
  if (!user) {
    return <Navigate to='/landing' />;
  }

  if(allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to='/' />;
  }


  return children;
};
export default ProtectedRoute;
