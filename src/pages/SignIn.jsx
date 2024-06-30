import * as React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import FormControlLabel from "@mui/material/FormControlLabel";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import CircularIndeterminate from "../components/CircularIndeterminate";
import FeedbackSnackbar from "../components/FeedbackSnackbar";
import BasicTextField from "../components/BasicTextField";
import Copyright from "../components/Copyright";
import Basic from "../components/button/Basic";
import { AuthenticationContext } from "../context/AuthenticationContext";
import { signIn } from "../services/authService";

const defaultTheme = createTheme();

export default function SignIn() {
  const { setUser } = React.useContext(AuthenticationContext);
  const [isLoadingAnimation, setIsLoadingAnimation] = React.useState(false);

  /* snackbar feedback */
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [severitySnackbar, setSeveritySnackbar] = React.useState("warning");
  const [messageSnackbar, setMessageSnackbar] = React.useState("");

  const handleOpenSnackbar = (props) => {
    setSeveritySnackbar(props.severity);
    setMessageSnackbar(props.message);
    setOpenSnackbar(true);
  };

  /* submitting action */
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    try {
      setIsLoadingAnimation(true);
      const user = await signIn(data.get("email"), data.get("password"));
      console.log(user);
      setUser(user);
      navigate("/");
    } catch (error) {
      console.error(`error on sign in: ${error.message}`);
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsLoadingAnimation(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1641831705160-5d56ac4094cb")',
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "left",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h6">
              Fazer logon
            </Typography>
            <Typography variant="subtitle1">
              Para sua proteção, verifique a sua identidade.
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <BasicTextField
                required
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <BasicTextField
                required
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Basic
                type="submit"
                fullWidth
                disable={isLoadingAnimation}
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoadingAnimation && (
                  <CircularIndeterminate size={25} color="inherit" />
                )}
                {!isLoadingAnimation && "Sign In"}
              </Basic>
              <Grid container>
                <Grid item xs>
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    variant="body2"
                  >
                    Esqueceu sua senha?
                  </Link>
                </Grid>
                <Grid item>
                  <Link component={RouterLink} to="/sign-up" variant="body2">
                    {"Não tem uma conta? Cadastre-se"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
        <FeedbackSnackbar
          open={openSnackbar}
          severity={severitySnackbar}
          message={messageSnackbar}
          onClose={() => setOpenSnackbar(false)}
        />
      </Grid>
    </ThemeProvider>
  );
}
