import { Link } from 'react-router-dom';
import img from '../assets/images/403-page.webp';
import Wrapper from '../assets/wrappers/ErrorPage';

const Unauthorize = () => {
  return (
    <Wrapper className='full-page'>
      <div>
        <img src={img} alt='not found' />
        <h3>403</h3>
        <p>You are not allow to access this page</p>
        <Link to='/home/login'>back to Profile</Link>
      </div>
    </Wrapper>
  );
};
export default Unauthorize;
