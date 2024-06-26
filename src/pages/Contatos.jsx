import * as React from "react";

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
import AdministrativePanel from "../layouts/AdministrativePanel";
import FeedbackSnackbar from "../components/FeedbackSnackbar";
import BasicTextField from "../components/BasicTextField";
import DeleteDialog from "../components/DeleteDialog";
import BasicSelect from "../components/BasicSelect";
import Cancel from "../components/button/Cancel";
import BasicCard from "../components/BasicCard";
import Basic from "../components/button/Basic";
import Save from "../components/button/Save";
import { get as getFornecedores } from "../services/fornecedorService";
import {
  create,
  get,
  updateById,
  deleteById,
} from "../services/contatoService";

export default function Contatos() {
  /* contatos */
  const [contatos, setContatos] = React.useState([]);
  const [selectedContato, setSelectedContato] = React.useState(null);
  const [isSearchingAnimation, setIsSearchingAnimation] = React.useState(false);

  async function find() {
    try {
      setIsSearchingAnimation(true);
      const data = await get();
      setContatos(data);
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

  /* searching fornecedores */
  const [fornecedores, setFornecedores] = React.useState([]);
  const [
    isFornecedoresSearchingAnimation,
    setIsFornecedoresSearchingAnimation,
  ] = React.useState(false);

  async function findFornecedores() {
    try {
      setIsFornecedoresSearchingAnimation(true);
      const data = await getFornecedores();
      setFornecedores(data);
    } catch (error) {
      console.error(`error while fetching fornecedores: ${error.message}`);
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsFornecedoresSearchingAnimation(false);
    }
  }

  React.useEffect(() => {
    findFornecedores();
  }, []);

  /* pagination */
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /* deleting action */
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isDeletingAnimation, setIsDeletingAnimation] = React.useState(false);

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

  /* init formData */
  const [formData, setFormData] = React.useState({
    nome: "",
    telefone: "",
    email: "",
    cargo: "",
    fornecedorId: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  /* setup form modes */
  const [formMode, setFormMode] = React.useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

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
    setSelectedContato(null);
  };

  /* creating action */
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

  /* updating action */
  const [isUpdatingAnimation, setIsUpdatingAnimation] = React.useState(false);

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

  /* snackbar feedback */
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
                    label={`${contato.fornecedor?.nome || "not applicable"}`}
                    title={contato.nome}
                    subtitle={contato.cargo}
                    description={`Para mais informações, envie um email para ${
                      contato.email
                    }${
                      contato.telefone
                        ? ` ou ligue para ${contato.telefone}`
                        : ""
                    }.`}
                    actions={
                      <Stack direction="row" spacing={1}>
                        <Button
                          onClick={() => showUpdate(contato)}
                          sx={{
                            textTransform: "capitalize",
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          color="error"
                          onClick={() => showDelete(contato)}
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
          </>
        )}
      </Stack>
      <DeleteDialog
        open={isDeleting}
        onCancel={hideDelete}
        onConfirm={handleDelete}
        isDeletingAnimation={isDeletingAnimation}
      />
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
              id="name"
              name="telefone"
              label="Telefone"
              value={formData.telefone}
              onChange={handleInputChange}
            />
            <BasicTextField
              required
              id="name"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <BasicTextField
              required
              id="name"
              name="cargo"
              label="Cargo"
              value={formData.cargo}
              onChange={handleInputChange}
            />
            <BasicSelect
              required
              label="Fornecedor"
              value={formData.fornecedorId}
              onChange={(event) =>
                setFormData({ ...formData, fornecedorId: event.target.value })
              }
            >
              {isFornecedoresSearchingAnimation && (
                <MenuItem disabled>Loading...</MenuItem>
              )}
              {!isFornecedoresSearchingAnimation &&
                fornecedores.map((fornecedor) => (
                  <MenuItem key={fornecedor.id} value={fornecedor.id}>
                    {fornecedor.nome}
                  </MenuItem>
                ))}
            </BasicSelect>
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
      <FeedbackSnackbar
        open={openSnackbar}
        severity={severitySnackbar}
        message={messageSnackbar}
        onClose={() => setOpenSnackbar(false)}
      />
    </AdministrativePanel>
  );
}
