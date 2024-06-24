import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import TablePagination from "@mui/material/TablePagination";

import AdministrativePanel from "../layouts/AdministrativePanel";
import {
  create,
  get,
  updateById,
  deleteById,
} from "../services/categoriaDeProdutoService";
import Create from "../components/button/Create";
import BasicCard from "../components/BasicCard";
import DeleteDialog from "../components/DeleteDialog";
import Save from "../components/button/Save";
import Cancel from "../components/button/Cancel";
import FeedbackSnackbar from "../components/FeedbackSnackbar";
import CircularIndeterminate from "../components/CircularIndeterminate";

export default function CategoriasDeProdutos() {
  const [cProdutos, setCProdutos] = React.useState([]);
  const [selectedCProduto, setSelectedCProduto] = React.useState(null);
  const [isSearchingAnimation, setIsSearchingAnimation] = React.useState(false);

  async function find() {
    try {
      setIsSearchingAnimation(true);
      const data = await get();
      setCProdutos(data);
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

  const showDelete = (cProduto) => {
    setSelectedCProduto(cProduto);
    setIsDeleting(true);
  };

  const hideDelete = () => {
    setIsDeleting(false);
    setSelectedCProduto(null);
  };

  const handleDelete = async () => {
    if (!selectedCProduto) return;

    try {
      setIsDeletingAnimation(true);
      await deleteById(selectedCProduto.id);
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
    imagemUrl: "",
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

    if (formMode === "create") {
      handleCreate();
    } else if (formMode === "update") {
      handleUpdate();
    }
  };

  const hideForm = () => {
    setFormMode(null);
    setFormData({
      nome: "",
      imagemUrl: "",
    });
    setSelectedCProduto(null);
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

  const showUpdate = (cProduto) => {
    setSelectedCProduto(cProduto);
    setFormData({
      nome: cProduto.nome || "",
      imagemUrl: cProduto.imagemUrl || "",
    });
    setFormMode("update");
  };

  const handleUpdate = async () => {
    if (!selectedCProduto) return;

    try {
      setIsUpdatingAnimation(true);
      await updateById(selectedCProduto.id, formData);
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
          <Create onClick={() => setFormMode("create")} />
        </Box>
        {isSearchingAnimation ? (
          <CircularIndeterminate />
        ) : (
          <>
            {cProdutos.length > 0 ? (
              <Stack direction="column" spacing={3}>
                {(rowsPerPage > 0
                  ? cProdutos.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : cProdutos
                ).map((cProduto) => (
                  <BasicCard
                    key={cProduto.id}
                    image={cProduto.imagemUrl}
                    title={cProduto.nome}
                    actions={
                      <Stack direction="row" spacing={1}>
                        <Button
                          onClick={() => showUpdate(cProduto)}
                          sx={{
                            textTransform: "capitalize",
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          color="error"
                          onClick={() => showDelete(cProduto)}
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
                  count={cProdutos.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Stack>
            ) : (
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  textTransform: "lowercase",
                }}
              >
                não há categorias de produtos cadastradas.
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
            <TextField
              required
              margin="dense"
              id="name"
              name="nome"
              label="Nome"
              type="text"
              fullWidth
              variant="standard"
              value={formData.nome}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              id="name"
              name="imagemUrl"
              label="Imagem"
              type="text"
              fullWidth
              variant="standard"
              value={formData.imagemUrl}
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
