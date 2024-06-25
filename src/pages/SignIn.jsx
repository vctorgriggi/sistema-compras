import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

import Copyright from "../components/Copyright";
import FeedbackSnackbar from "../components/FeedbackSnackbar";
import { signIn } from "../services/authService";
import CircularIndeterminate from "../components/CircularIndeterminate";
import BasicTextField from "../components/BasicTextField";

const defaultTheme = createTheme();

export default function SignIn() {
  const [isLoadingAnimation, setIsLoadingAnimation] = React.useState(false);

  /**
   *
   */
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [severitySnackbar, setSeveritySnackbar] = React.useState("warning");
  const [messageSnackbar, setMessageSnackbar] = React.useState("");
  const handleOpenSnackbar = (props) => {
    setSeveritySnackbar(props.severity);
    setMessageSnackbar(props.message);
    setOpenSnackbar(true);
  };

  /**
   *
   */
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    try {
      setIsLoadingAnimation(true);
      const user = await signIn(data.get("email"), data.get("password"));
      console.log(user);
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
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
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
            onSubmit={handleSubmit}
            noValidate
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
              id="password"
              label="Senha"
              type="password"
              name="password"
              autoComplete="current-password"
            />
            {/*            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Permanecer conectado"
            /> */}
            <Button
              disabled={isLoadingAnimation}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoadingAnimation ? (
                <CircularIndeterminate size={25} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link component={RouterLink} to="" variant="body2">
                  Redefina sua senha
                </Link>
              </Grid> */}
              <Grid item>
                <Link component={RouterLink} to="/sign-up">
                  Não tem uma conta? Cadastre-se
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/**
         *
         */}
        <Copyright sx={{ mt: 8, mb: 4 }} />

        {/**
         *
         */}
        <FeedbackSnackbar
          open={openSnackbar}
          severity={severitySnackbar}
          message={messageSnackbar}
          onClose={() => setOpenSnackbar(false)}
        />
      </Container>
    </ThemeProvider>
  );
}
