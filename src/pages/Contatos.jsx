import { Fragment, useState, useEffect } from "react";

import TablePagination from "@mui/material/TablePagination";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import CircularIndeterminate from "../components/CircularIndeterminate";
import { get as getFornecedores } from "../services/fornecedorService";
import { validateEmail, validatePhone } from "../utils/validators";
import AdministrativePanel from "../layouts/AdministrativePanel";
import FeedbackSnackbar from "../components/FeedbackSnackbar";
import BasicTextField from "../components/BasicTextField";
import CancelButton from "../components/button/Cancel";
import DeleteDialog from "../components/DeleteDialog";
import BasicButton from "../components/button/Basic";
import BasicSelect from "../components/BasicSelect";
import SaveButton from "../components/button/Save";
import BasicCard from "../components/BasicCard";
import {
  create,
  get,
  updateById,
  deleteById,
} from "../services/contatoService";

export default function Contatos() {
  /* contatos */
  const [contatos, setContatos] = useState([]);
  const [selectedContato, setSelectedContato] = useState(null);
  const [isSearchingAnimation, setIsSearchingAnimation] = useState(false);

  async function find() {
    try {
      setIsSearchingAnimation(true);
      const data = await get();
      setContatos(data);
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

  /* searching suppliers */
  const [fornecedores, setFornecedores] = useState([]);
  const [
    isSearchingFornecedoresAnimation,
    setIsSearchingFornecedoresAnimation,
  ] = useState(false);

  async function findFornecedores() {
    try {
      setIsSearchingFornecedoresAnimation(true);
      const data = await getFornecedores();
      setFornecedores(data);
    } catch (error) {
      console.error("Error while fetching suppliers:", error.message);
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsSearchingFornecedoresAnimation(false);
    }
  }

  useEffect(() => {
    findFornecedores();
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

  const showDelete = (contato) => {
    setSelectedContato(contato);
    setIsDeleting(true);
  };

  const hideDelete = () => {
    setIsDeleting(false);
    setSelectedContato(null);
  };

  const handleDelete = async () => {
    if (!selectedContato) return;

    try {
      setIsDeletingAnimation(true);
      await deleteById(selectedContato.id);
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
    telefone: "",
    email: "",
    cargo: "",
    fornecedorId: "",
  });

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  /* init form errors */
  const [formErrors, setFormErrors] = useState({
    nome: "",
    telefone: "",
    email: "",
    cargo: "",
    fornecedorId: "",
  });

  const validateForm = () => {
    const errors = {
      // object to store errors
    };

    if (!formData.nome) errors.nome = "Nome é obrigatório";
    if (formData.telefone && !validatePhone(formData.telefone)) {
      errors.telefone = "Formato de telefone inválido.";
    }
    if (!formData.email) {
      errors.email = "Email é obrigatório.";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Formato de email inválido.";
    }
    if (!formData.cargo) errors.cargo = "Cargo é obrigatório";
    if (!formData.fornecedorId)
      errors.fornecedorId = "Fornecedor é obrigatório";

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
      telefone: "",
      email: "",
      cargo: "",
      fornecedorId: "",
    });
    setFormErrors({
      nome: "",
      telefone: "",
      email: "",
      cargo: "",
      fornecedorId: "",
    });
    setSelectedContato(null);
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

  const showUpdate = (contato) => {
    setSelectedContato(contato);
    setFormData({
      nome: contato.nome || "",
      telefone: contato.telefone || "",
      email: contato.email || "",
      cargo: contato.cargo || "",
      fornecedorId: contato.fornecedor?.id || "",
    });
    setFormMode("update");
  };

  const handleUpdate = async () => {
    if (!selectedContato) return;

    try {
      setIsUpdatingAnimation(true);
      await updateById(selectedContato.id, formData);
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
            {contatos.length > 0 && (
              <Stack direction="column" spacing={3}>
                {(rowsPerPage > 0
                  ? contatos.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : contatos
                ).map((contato) => (
                  <BasicCard
                    key={contato.id}
                    overline={contato.fornecedor?.nome || "not applicable"}
                    title={contato.nome}
                    caption={contato.cargo}
                    supporting={
                      `Entre em contato` +
                      (contato.telefone
                        ? ` pelo telefone ${contato.telefone}, ou`
                        : "") +
                      ` através do email ${contato.email}.`
                    }
                    actions={
                      <Stack direction="row" spacing={1}>
                        <Button
                          onClick={() => showUpdate(contato)}
                          sx={{ textTransform: "capitalize" }}
                        >
                          Editar
                        </Button>
                        <Button
                          color="error"
                          onClick={() => showDelete(contato)}
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
                  count={contatos.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Stack>
            )}
            {contatos.length === 0 && (
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  textTransform: "lowercase",
                }}
              >
                não há contatos cadastrados.
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
              required
              id="cargo"
              name="cargo"
              label="Cargo"
              value={formData.cargo}
              onChange={handleFieldChange}
              error={!!formErrors.cargo}
              helperText={formErrors.cargo}
            />
            <BasicSelect
              required
              name="fornecedorId"
              label="Fornecedor"
              value={formData.fornecedorId}
              onChange={handleFieldChange}
              error={!!formErrors.fornecedorId}
              helperText={formErrors.fornecedorId}
            >
              {isSearchingFornecedoresAnimation && (
                <MenuItem disabled>Loading...</MenuItem>
              )}
              {!isSearchingFornecedoresAnimation &&
                fornecedores.map((fornecedor) => (
                  <MenuItem key={fornecedor.id} value={fornecedor.id}>
                    {fornecedor.nome}
                  </MenuItem>
                ))}
            </BasicSelect>
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
