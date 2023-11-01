import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { toast } from "react-toastify";
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

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({ username: "", password: "" });

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
      console.log(userDataResponse);
      if (
        userDataResponse &&
        userDataResponse.isError === false &&
        userDataResponse.result !== null
      ) {
        const { role, firstName, lastName } = userDataResponse.result;
        dispatch(setUser(userDataResponse.result));
        switch (role) {
          case 0:
            navigate("/home/customer");
            toast.success(`Welcome Admin: ${lastName} ${firstName}`, {
              autoClose: 1000,
              hideProgressBar: false,
            });
            break;
          case 1:
            navigate("/home/menu");
            toast.success(`Welcome User: ${lastName} ${firstName}`, {
              autoClose: 1000,
              hideProgressBar: false,
            });
            break;
          case 2:
            navigate("/home/listTicket");
            toast.success(`Welcome Manager: ${lastName} ${firstName}`, {
              autoClose: 1000,
              hideProgressBar: false,
            });
            break;
          case 3: 
            navigate("/home/ticketSolution");
            toast.success(`Welcome Technician: ${lastName} ${firstName}`, {
              autoClose: 1000,
              hideProgressBar: false,
            });
            break;
          default:
            navigate("/login");
            toast.error("Login Fail", {
              autoClose: 1000,
              hideProgressBar: false,
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
                    maxWidth: "100%",
                    height: "auto",
                    maxWidth: "200px",
                  }} // Adjust the maxWidth as per your requirement
                />{" "}
              </Typography>
              <Typography
                component="h1"
                variant="h5"
                sx={{ fontWeight: "bold", fontSize: "24px" }}
              >
                Login Page
              </Typography>
              <Box component="form" noValidate sx={{ mt: 1 }}>
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
                  {loading ? <CircularProgress size={24} /> : "Login"}
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
