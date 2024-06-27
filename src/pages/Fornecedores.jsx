import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TablePagination from "@mui/material/TablePagination";

import AdministrativePanel from "../layouts/AdministrativePanel";
import {
  create,
  get,
  updateById,
  deleteById,
} from "../services/fornecedorService";
import Basic from "../components/button/Basic";
import BasicCard from "../components/BasicCard";
import DeleteDialog from "../components/DeleteDialog";
import Save from "../components/button/Save";
import Cancel from "../components/button/Cancel";
import FeedbackSnackbar from "../components/FeedbackSnackbar";
import CircularIndeterminate from "../components/CircularIndeterminate";
import BasicTextField from "../components/BasicTextField";

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = React.useState([]);
  const [selectedFornecedor, setSelectedFornecedor] = React.useState(null);
  const [isSearchingAnimation, setIsSearchingAnimation] = React.useState(false);

  async function find() {
    try {
      setIsSearchingAnimation(true);
      const data = await get();
      setFornecedores(data);
    } catch (error) {
      console.error(`error on find: ${error.message}`);
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsSearchingAnimation(false);
    }
  }

  React.useEffect(() => {
    find();
  }, []);

  /**
   *
   */
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**
   *
   */
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isDeletingAnimation, setIsDeletingAnimation] = React.useState(false);

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
      console.error(`error on delete: ${error.message}`);
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsDeletingAnimation(false);
      hideDelete();
    }
  };

  /**
   *
   */
  const [formData, setFormData] = React.useState({
    nome: "",
    endereco: "",
    telefone: "",
    email: "",
    cnpj: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   *
   */
  const [formMode, setFormMode] = React.useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

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
    setSelectedFornecedor(null);
  };

  /**
   *
   */
  const [isCreatingAnimation, setIsCreatingAnimation] = React.useState(false);

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
      console.error(`error on create: ${error.message}`);
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsCreatingAnimation(false);
      hideForm();
    }
  };

  /**
   *
   */
  const [isUpdatingAnimation, setIsUpdatingAnimation] = React.useState(false);

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
      console.error(`error on update: ${error.message}`);
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingAnimation(false);
      hideForm();
    }
  };

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

  return (
    <AdministrativePanel>
      {/**
       *
       */}
      <Stack direction="column" spacing={4}>
        <Box
          component="div"
          sx={{
            width: "100%",
          }}
        >
          <Basic onClick={() => setFormMode("create")} />
        </Box>
        {isSearchingAnimation && <CircularIndeterminate />}
        {!isSearchingAnimation && (
          <>
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
                    label={`${fornecedor.cnpj}`}
                    title={fornecedor.nome}
                    subtitle={fornecedor.endereco}
                    description={`Para mais informações, ${
                      fornecedor.email
                        ? `envie um email para ${fornecedor.email} ou`
                        : ""
                    } ligue para ${fornecedor.telefone}.`}
                    actions={
                      <Stack direction="row" spacing={1}>
                        <Button
                          onClick={() => showUpdate(fornecedor)}
                          sx={{
                            textTransform: "capitalize",
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          color="error"
                          onClick={() => showDelete(fornecedor)}
                          sx={{
                            textTransform: "capitalize",
                          }}
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
          </>
        )}
      </Stack>

      {/**
       *
       */}
      <DeleteDialog
        open={isDeleting}
        onCancel={hideDelete}
        onConfirm={handleDelete}
        isDeletingAnimation={isDeletingAnimation}
      />

      {/**
       *
       */}
      <Dialog open={formMode !== null} onClose={hideForm}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          // noValidate
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
              id="name"
              name="nome"
              label="Nome"
              value={formData.nome}
              onChange={handleInputChange}
            />
            <BasicTextField
              required
              id="name"
              name="endereco"
              label="Endereço"
              value={formData.endereco}
              onChange={handleInputChange}
            />
            <BasicTextField
              required
              id="name"
              name="telefone"
              label="Telefone"
              value={formData.telefone}
              onChange={handleInputChange}
            />
            <BasicTextField
              id="name"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <BasicTextField
              id="name"
              name="cnpj"
              label="CNPJ"
              value={formData.cnpj}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Cancel onClick={hideForm} />
            <Save
              isCreatingAnimation={isCreatingAnimation}
              isUpdatingAnimation={isUpdatingAnimation}
              formMode={formMode}
            />
          </DialogActions>
        </Box>
      </Dialog>

      {/**
       *
       */}
      <FeedbackSnackbar
        open={openSnackbar}
        severity={severitySnackbar}
        message={messageSnackbar}
        onClose={() => setOpenSnackbar(false)}
      />
    </AdministrativePanel>
  );
}
