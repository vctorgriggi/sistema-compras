import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import Copyright from "../components/Copyright";
import FeedbackSnackbar from "../components/FeedbackSnackbar";
import { forgotPassword } from "../services/authService";
import BasicTextField from "../components/BasicTextField";
import Basic from "../components/button/Basic";

const defaultTheme = createTheme();

export default function ForgotPassword() {
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
  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    try {
      forgotPassword(data.get("email"));
      setActiveStep(1);
    } catch (error) {
      console.error(`error while trying to reset password: ${error.message}`);
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    }
  };

  /**
   *
   */
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = ["Insira seu email", "Verificar sua identidade"];

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
            nunc congue nisi vitae
          </Typography>
          <Box
            component="div"
            sx={{
              width: "100%",
            }}
          >
            <Stepper activeStep={activeStep} sx={{ pt: 5 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          {activeStep === 0 && (
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={1}>
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
                  <Typography variant="caption" color="text.secondary">
                    Um link será enviado para o seu email para redefinir sua
                    senha.
                  </Typography>
                </Grid>
              </Grid>
              <Basic type="submit" fullWidth sx={{ mt: 3, mb: 2 }}>
                Continuar
              </Basic>
            </Box>
          )}
          {activeStep === 1 && (
            <Box component="div" sx={{ mt: 3 }}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: 2,
                  textAlign: "justify",
                }}
              >
                Se o email informado for válido, você receberá um link para
                redefinir a senha. Utilize esse link para acessar a página de
                redefinição de senha e criar uma nova senha com segurança.
              </Typography>
            </Box>
          )}
          <Grid container justifyContent="flex-end">
            <Grid item>
              {activeStep === 0 && (
                <Link component={RouterLink} to="/sign-in" variant="body2">
                  Voltar para entrar
                </Link>
              )}
              {activeStep === 1 && (
                <Link
                  component="button"
                  onClick={() => setActiveStep(0)}
                  variant="body2"
                >
                  Voltar
                </Link>
              )}
            </Grid>
          </Grid>
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
