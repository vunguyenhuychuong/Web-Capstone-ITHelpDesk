import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {Button, CircularProgress, Container,Typography, Box, Grid, TextField, Link, FormControlLabel,Paper, Checkbox } from "@mui/material";
import { setUser, setError, clearError } from "../features/user/authSlice";
import { LoginUser } from "../app/api";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({ username: '', password: '' });

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // if(!usernameRegex.test(data.username)){
    //   toast.error("UserName phải in hoa chữ đầu ít nhất 6 ký tự");
    //   return;
    // }
    // if(!passwordRegex.test(data.password)) {
    //   toast.error("Password phải In Hoa chữ đầu ít nhất 8 ký tự");
    //   return;
    // }
    setLoading(true);
    try {
      dispatch(clearError()); 
      const userDataResponse = await LoginUser(data); 
      if (userDataResponse !== null) {
        dispatch(setUser(userDataResponse)); 
        localStorage.setItem("profileAdmin",JSON.stringify(userDataResponse));
        navigate("/profile");
        toast.success("Login Success");
      } else {
        navigate("/login");
        toast.success("Login Fail");
      }
    } catch (error) {
      dispatch(setError(error.response.data));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: 8,
        }}
      >
        <Grid container>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={6}
            sx={{
              backgroundImage: "url(https://wpmanageninja.com/wp-content/uploads/2021/03/Untitled-design-1-1.png)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Login Page
              </Typography>
              <Box
                component="form"
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="User name"
                  name="username"
                  autoFocus
                  value={data.username}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={data.password}
                  onChange={handleChange}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                  onClick={handleLogin}
                >
                  {loading ? <CircularProgress size={24} /> : 'Login' }
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="/forgot-password" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
export default Login;
