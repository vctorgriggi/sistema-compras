import * as React from "react";
import Avatar from "@mui/material/Avatar";
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
import { signUp } from "../services/authService";
import CircularIndeterminate from "../components/CircularIndeterminate";
import BasicTextField from "../components/BasicTextField";
import Basic from "../components/button/Basic";

const defaultTheme = createTheme();

export default function SignUp() {
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
      const user = await signUp(data.get("email"), data.get("password"));
      console.log(user);
      navigate("/");
    } catch (error) {
      console.error(`error on sign up: ${error.message}`);
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
            Criar uma conta
          </Typography>
          <Typography variant="subtitle1">
            senectus et netus et malesuada
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <BasicTextField
                  required
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <BasicTextField
                  required
                  id="password"
                  label="Senha"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="Entre em contato comigo por email"
                />
              </Grid> */}
            </Grid>
            <Basic
              type="submit"
              fullWidth
              disabled={isLoadingAnimation}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoadingAnimation && (
                <CircularIndeterminate size={25} color="inherit" />
              )}
              {!isLoadingAnimation && "Sign Up"}
            </Basic>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/sign-in" variant="body2">
                  Já tem uma conta? Faça login.
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/**
         *
         */}
        <Copyright sx={{ mt: 5 }} />

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
