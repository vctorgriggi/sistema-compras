import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Step from "@mui/material/Step";
import Box from "@mui/material/Box";

import CircularIndeterminate from "../components/CircularIndeterminate";
import FeedbackSnackbar from "../components/FeedbackSnackbar";
import BasicTextField from "../components/BasicTextField";
import { forgotPassword } from "../services/authService";
import BasicButton from "../components/button/Basic";
import { validateEmail } from "../utils/validators";
import Copyright from "../components/Copyright";

const defaultTheme = createTheme();

export default function ForgotPassword() {
  const [isLoadingAnimation, setIsLoadingAnimation] = useState(false);

  /* snackbar feedback */
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severitySnackbar, setSeveritySnackbar] = useState("warning");
  const [messageSnackbar, setMessageSnackbar] = useState("");

  const handleOpenSnackbar = (props) => {
    setSeveritySnackbar(props.severity);
    setMessageSnackbar(props.message);
    setOpenSnackbar(true);
  };

  /* stepper settings */
  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Insira seu email", "Verificar sua identidade"];

  /* init form data */
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  /* init form errors */
  const [formErrors, setFormErrors] = useState({
    email: "",
  });

  const validateForm = () => {
    const errors = {
      // object to store errors
    };

    if (!formData.email) {
      errors.email = "Email é obrigatório.";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Formato de email inválido.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /* submitting action */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoadingAnimation(true);
      await forgotPassword(formData.email);
      setActiveStep(1);
    } catch (error) {
      console.error("Error while trying to reset password:", error.message);
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
            mt: 8,
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
          <Box component="div" sx={{ width: "100%" }}>
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
              sx={{ mt: 2 }}
            >
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <BasicTextField
                    required
                    id="email"
                    label="Email"
                    name="email"
                    onChange={handleFieldChange}
                    autoComplete="email"
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Um link será enviado para o seu email para redefinir sua
                    senha.
                  </Typography>
                </Grid>
              </Grid>
              <BasicButton
                type="submit"
                fullWidth
                disabled={isLoadingAnimation}
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoadingAnimation && (
                  <CircularIndeterminate size={24} color="inherit" />
                )}
                {!isLoadingAnimation && "Continuar"}
              </BasicButton>
            </Box>
          )}
          {activeStep === 1 && (
            <Box component="div" sx={{ my: 2 }}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: "justify" }}
              >
                Se o email informado for válido, você receberá um link para
                redefinição de senha. Utilize esse link para acessar a página de
                redefinição e criar uma nova senha com segurança.
              </Typography>
            </Box>
          )}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/sign-in" variant="body2">
                Voltar para entrar
              </Link>
            </Grid>
          </Grid>
        </Box>
        <Copyright sx={{ mt: 5 }} />
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
