import { Fragment, useState, useEffect } from "react";

import DialogContentText from "@mui/material/DialogContentText";
import TablePagination from "@mui/material/TablePagination";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import CircularIndeterminate from "../components/CircularIndeterminate";
import AdministrativePanel from "../layouts/AdministrativePanel";
import FeedbackSnackbar from "../components/FeedbackSnackbar";
import BasicTextField from "../components/BasicTextField";
import CancelButton from "../components/button/Cancel";
import DeleteDialog from "../components/DeleteDialog";
import BasicButton from "../components/button/Basic";
import SaveButton from "../components/button/Save";
import BasicCard from "../components/BasicCard";
import {
  create,
  get,
  updateById,
  deleteById,
} from "../services/fornecedorService";
import {
  validateEmail,
  validatePhone,
  validateIdentity,
} from "../utils/validators";

export default function Fornecedores() {
  /* fornecedores */
  const [fornecedores, setFornecedores] = useState([]);
  const [selectedFornecedor, setSelectedFornecedor] = useState(null);
  const [isSearchingAnimation, setIsSearchingAnimation] = useState(false);

  async function find() {
    try {
      setIsSearchingAnimation(true);
      const data = await get();
      setFornecedores(data);
    } catch (error) {
      console.error("Error on find:", error.message);
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsSearchingAnimation(false);
    }
  }

  useEffect(() => {
    find();
  }, []);

  /* pagination */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /* deleting action */
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingAnimation, setIsDeletingAnimation] = useState(false);

  const showDelete = (fornecedor) => {
    setSelectedFornecedor(fornecedor);
    setIsDeleting(true);
  };

  const hideDelete = () => {
    setIsDeleting(false);
    setSelectedFornecedor(null);
  };

  const handleDelete = async () => {
    if (!selectedFornecedor) return;

    try {
      setIsDeletingAnimation(true);
      await deleteById(selectedFornecedor.id);
      await find();
      handleOpenSnackbar({
        severity: "success",
        message: "Exclusão bem-sucedida: o conteúdo foi removido.",
      });
    } catch (error) {
      console.error("Error on delete:", error.message);
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsDeletingAnimation(false);
      hideDelete();
    }
  };

  /* init form data */
  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    telefone: "",
    email: "",
    cnpj: "",
  });

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  /* init form errors */
  const [formErrors, setFormErrors] = useState({
    nome: "",
    endereco: "",
    telefone: "",
    email: "",
    cnpj: "",
  });

  const validateForm = () => {
    const errors = {
      // object to store errors
    };

    if (!formData.nome) errors.nome = "Nome é obrigatório.";
    if (!formData.endereco) errors.endereco = "Endereço é obrigatório.";
    if (formData.telefone && !validatePhone(formData.telefone)) {
      errors.telefone = "Formato de telefone inválido.";
    }
    if (!formData.email) {
      errors.email = "Email é obrigatório.";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Formato de email inválido.";
    }
    if (formData.cnpj && !validateIdentity(formData.cnpj)) {
      errors.cnpj = "Formato de CNPJ inválido.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /* setup form */
  const [formMode, setFormMode] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    formMode === "create" ? handleCreate() : handleUpdate();
  };

  const hideForm = () => {
    setFormMode(null);
    setFormData({
      nome: "",
      endereco: "",
      telefone: "",
      email: "",
      cnpj: "",
    });
    setFormErrors({
      nome: "",
      endereco: "",
      telefone: "",
      email: "",
      cnpj: "",
    });
    setSelectedFornecedor(null);
  };

  /* creating action */
  const [isCreatingAnimation, setIsCreatingAnimation] = useState(false);

  const handleCreate = async () => {
    try {
      setIsCreatingAnimation(true);
      await create(formData);
      await find();
      handleOpenSnackbar({
        severity: "success",
        message: "Nova adição: o conteúdo foi criado conforme solicitado.",
      });
    } catch (error) {
      console.error("Error on create:", error.message);
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsCreatingAnimation(false);
      hideForm();
    }
  };

  /* updating action */
  const [isUpdatingAnimation, setIsUpdatingAnimation] = useState(false);

  const showUpdate = (fornecedor) => {
    setSelectedFornecedor(fornecedor);
    setFormData({
      nome: fornecedor.nome || "",
      endereco: fornecedor.endereco || "",
      telefone: fornecedor.telefone || "",
      email: fornecedor.email || "",
      cnpj: fornecedor.cnpj || "",
    });
    setFormMode("update");
  };

  const handleUpdate = async () => {
    if (!selectedFornecedor) return;

    try {
      setIsUpdatingAnimation(true);
      await updateById(selectedFornecedor.id, formData);
      await find();
      handleOpenSnackbar({
        severity: "success",
        message: "Sucesso na edição: as alterações foram salvas.",
      });
    } catch (error) {
      console.error("Error on update:", error.message);
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingAnimation(false);
      hideForm();
    }
  };

  /* snackbar feedback */
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severitySnackbar, setSeveritySnackbar] = useState("warning");
  const [messageSnackbar, setMessageSnackbar] = useState("");

  const handleOpenSnackbar = (props) => {
    setSeveritySnackbar(props.severity);
    setMessageSnackbar(props.message);
    setOpenSnackbar(true);
  };

  return (
    <AdministrativePanel>
      <Stack direction="column" spacing={4}>
        <Box component="div" sx={{ width: "100%" }}>
          <BasicButton onClick={() => setFormMode("create")} />
        </Box>
        {isSearchingAnimation && <CircularIndeterminate />}
        {!isSearchingAnimation && (
          <Fragment>
            {fornecedores.length > 0 && (
              <Stack direction="column" spacing={3}>
                {(rowsPerPage > 0
                  ? fornecedores.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : fornecedores
                ).map((fornecedor) => (
                  <BasicCard
                    key={fornecedor.id}
                    overline={fornecedor.cnpj}
                    title={fornecedor.nome}
                    caption={fornecedor.endereco}
                    supporting={
                      `Entre em contato` +
                      (fornecedor.telefone
                        ? ` pelo telefone ${fornecedor.telefone}, ou`
                        : "") +
                      ` através do email ${fornecedor.email}.`
                    }
                    actions={
                      <Stack direction="row" spacing={1}>
                        <Button
                          onClick={() => showUpdate(fornecedor)}
                          sx={{ textTransform: "capitalize" }}
                        >
                          Editar
                        </Button>
                        <Button
                          color="error"
                          onClick={() => showDelete(fornecedor)}
                          sx={{ textTransform: "capitalize" }}
                        >
                          Apagar
                        </Button>
                      </Stack>
                    }
                  />
                ))}
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  component="div"
                  count={fornecedores.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Stack>
            )}
            {fornecedores.length === 0 && (
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  textTransform: "lowercase",
                }}
              >
                não há fornecedores cadastrados.
              </Typography>
            )}
          </Fragment>
        )}
      </Stack>
      <DeleteDialog
        open={isDeleting}
        onCancel={hideDelete}
        onConfirm={handleDelete}
        isDeletingAnimation={isDeletingAnimation}
      />
      <Dialog
        open={formMode !== null}
        onClose={hideForm}
        scroll="paper"
        fullWidth
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
        >
          <DialogTitle>
            {formMode === "update"
              ? "Atualize as informações do item"
              : "Novo item"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </DialogContentText>
            <BasicTextField
              required
              id="nome"
              name="nome"
              label="Nome"
              value={formData.nome}
              onChange={handleFieldChange}
              error={!!formErrors.nome}
              helperText={formErrors.nome}
            />
            <BasicTextField
              required
              id="endereco"
              name="endereco"
              label="Endereço"
              value={formData.endereco}
              onChange={handleFieldChange}
              error={!!formErrors.endereco}
              helperText={formErrors.endereco}
            />
            <BasicTextField
              id="telefone"
              name="telefone"
              label="Telefone"
              type="tel"
              value={formData.telefone}
              onChange={handleFieldChange}
              error={!!formErrors.telefone}
              helperText={formErrors.telefone}
            />
            <BasicTextField
              required
              id="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleFieldChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <BasicTextField
              id="cnpj"
              name="cnpj"
              label="CNPJ"
              type="tel"
              value={formData.cnpj}
              onChange={handleFieldChange}
              error={!!formErrors.cnpj}
              helperText={formErrors.cnpj}
            />
          </DialogContent>
          <DialogActions>
            <CancelButton onClick={hideForm} />
            <SaveButton
              isCreatingAnimation={isCreatingAnimation}
              isUpdatingAnimation={isUpdatingAnimation}
              formMode={formMode}
            />
          </DialogActions>
        </Box>
      </Dialog>
      <FeedbackSnackbar
        open={openSnackbar}
        severity={severitySnackbar}
        message={messageSnackbar}
        onClose={() => setOpenSnackbar(false)}
      />
    </AdministrativePanel>
  );
}
