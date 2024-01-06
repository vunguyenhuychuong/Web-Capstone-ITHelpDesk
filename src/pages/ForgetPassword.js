import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";

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
import { forgotPassword } from "../app/api/companyMember";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [errorText, setErrorText] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorText("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setErrorText("");
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/login`);
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
              backgroundImage:
                "url(https://wpmanageninja.com/wp-content/uploads/2021/03/Untitled-design-1-1.png)",
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
                Forgot Password Page
              </Typography>
              <Box
                component="form"
                noValidate
                sx={{ mt: 1 }}
                onSubmit={handleSubmit}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errorText && (
                  <Typography
                    color="error"
                    variant="body2"
                    sx={{ mt: 1, mb: 1 }}
                  >
                    {errorText}
                  </Typography>
                )}
                <FormControlLabel
                  control={
                    <Checkbox
                      value={confirmation}
                      onChange={() => setConfirmation(!confirmation)}
                      color="primary"
                    />
                  }
                  label="Confirm email"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Send"}
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                  onClick={() => handleGoBack()}
                >
                  Back to Login
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
export default ForgetPassword;
