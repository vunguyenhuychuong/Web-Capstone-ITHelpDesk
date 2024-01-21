import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Link,
  FormControlLabel,
  Paper,
  Checkbox,
} from "@mui/material";
import { setUser, setError, clearError } from "../features/user/authSlice";
import { LoginUser } from "../app/api";
import LoginPage from "../assets/images/loginpage.png";
import logoAvatar from "../assets/images/icon.png";
import { toast } from "react-toastify";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({ username: "", password: "" });

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      dispatch(clearError());
      const userDataResponse = await LoginUser(data);
      if (
        userDataResponse &&
        userDataResponse.isError === false &&
        userDataResponse.result !== null
      ) {
        const { role, firstName, lastName } = userDataResponse.result;
        dispatch(setUser(userDataResponse.result));
        switch (role) {
          case 0:
            navigate("/home/homeAdmin");
            toast.success(`Welcome Admin: ${lastName} ${firstName}`, {
              autoClose: 1000,
              hideProgressBar: false,
              position: toast.POSITION.TOP_CENTER,
            });
            break;
          case 1:
            navigate("/home/mains");
            toast.success(`Welcome User: ${lastName} ${firstName}`, {
              autoClose: 1000,
              hideProgressBar: false,
              position: toast.POSITION.TOP_CENTER,
            });
            break;
          case 2:
            navigate("/home/homeManager");
            toast.success(`Welcome Manager: ${lastName} ${firstName}`, {
              autoClose: 1000,
              hideProgressBar: false,
              position: toast.POSITION.TOP_CENTER,
            });
            break;
          case 3:
            navigate("/home/homeTechnician");
            toast.success(`Welcome Technician: ${lastName} ${firstName}`, {
              autoClose: 1000,
              hideProgressBar: false,
              position: toast.POSITION.TOP_CENTER,
            });
            break;
          case 4:
            navigate("/home/homeAccountant");
            toast.success(`Welcome Accountant: ${lastName} ${firstName}`, {
              autoClose: 1000,
              hideProgressBar: false,
              position: toast.POSITION.TOP_CENTER,
            });
            break;
          default:
            navigate("/login");
            toast.error("Login Fail", {
              autoClose: 1000,
              hideProgressBar: false,
              position: toast.POSITION.TOP_CENTER,
            });
        }
      } else {
        navigate("/login");
        toast.error("Login Fail", {
          autoClose: 1000,
          hideProgressBar: false,
        });
      }
    } catch (error) {
      dispatch(setError(error.message || "An error occurred during login."));
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

  const handleForgotPassword = () => {
    navigate(`/forgot-password`);
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
              backgroundImage: `url(${LoginPage})`,
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
                <img
                  src={logoAvatar}
                  alt="Logo"
                  style={{
                    height: "auto",
                    maxWidth: "200px",
                  }}
                />{" "}
              </Typography>
              <Typography
                component="h1"
                variant="h5"
                sx={{ fontWeight: "bold", fontSize: "24px" }}
              >
                Login
              </Typography>
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoFocus
                  value={data.username}
                  onChange={handleChange}
                  InputProps={{
                    style: {
                      borderRadius: 10,
                      height: "50px", // Set the desired height
                    },
                  }}
                  InputLabelProps={{
                    style: { fontWeight: "bold" },
                  }}
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
                  InputProps={{
                    style: {
                      borderRadius: 10,
                      height: "50px", // Set the same height as the username field
                    },
                  }}
                  InputLabelProps={{
                    style: { fontWeight: "bold" },
                  }}
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
                  {loading ? <CircularProgress size={24} /> : "Login"}
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link
                      onClick={() => handleForgotPassword()}
                      variant="body2"
                    >
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
