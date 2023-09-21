import { useState, useEffect } from 'react';
import { Logo } from '../components';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
};

function Register() {
  const [values, setValues] = useState(initialState);
  const { user, isLoading } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setValues({ ...values, [name]: value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    if (!email || !password || (!isMember && !name)) {
      toast.error('Please fill out all fields');
      return;
    }
    if (isMember) {
      dispatch(loginUser({ email: email, password: password }));
      return;
    }
    dispatch(registerUser({ name, email, password }));
  };

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  }, [user, navigate]);
  return (
    <Container maxWidth="xs">
      <form className='form' onSubmit={onSubmit}>
        <Box mt={4} display="flex" flexDirection="column" alignItems="center">
          <Logo />
          <Typography variant="h5">Login</Typography>
          {/* email field */}
          <TextField
            type='email'
            label='Email'
            name='email'
            value={values.email}
            onChange={handleChange}
            variant='outlined'
            margin='normal'
            fullWidth
            InputProps={{
              startAdornment: (
                <FaUser style={{ marginRight: '8px' }} />
              ),
            }}
          />
          {/* password field */}
          <TextField
            type='password'
            label='Password'
            name='password'
            value={values.password}
            onChange={handleChange}
            variant='outlined'
            margin='normal'
            fullWidth
            InputProps={{
              startAdornment: (
                <FaLock style={{ marginRight: '8px' }} />
              ),
            }}
          />
          
          <Button
            type='submit'
            variant='contained'
            color='primary'
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Submit'}
          </Button>
          <br />
          <Button
            type='button'
            variant='contained'
            color='secondary'
            fullWidth
            disabled={isLoading}
            onClick={() =>
              dispatch(
                loginUser({ email: 'testUser@test.com', password: 'secret' })
              )
            }
          >
            {isLoading ? 'Loading...' : 'Demo App'}
          </Button>
          <Typography>
            {values.isMember ? "Not a member yet?" : "Already a member?"}
            <Button
              type='button'
              onClick={toggleMember}
              color='primary'
            >
              {values.isMember ? 'Register' : 'Login'}
            </Button>
          </Typography>
        </Box>
      </form>
    </Container>
  );
}
export default Register;
