import { Fragment, useState, useEffect } from "react";

import DialogContentText from "@mui/material/DialogContentText";
import TablePagination from "@mui/material/TablePagination";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
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
import FileInput from "../components/FileInput";
import {
  create,
  get,
  updateById,
  deleteById,
} from "../services/categoriaDeProdutoService";

export default function CategoriasDeProdutos() {
  /* categorias de produtos */
  const [cProdutos, setCProdutos] = useState([]);
  const [selectedCProduto, setSelectedCProduto] = useState(null);
  const [isSearchingAnimation, setIsSearchingAnimation] = useState(false);

  async function find() {
    try {
      setIsSearchingAnimation(true);
      const data = await get();
      setCProdutos(data);
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
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    unsetImage: false,
  });

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleFileChange = (newFile) => {
    setFile(newFile);
  };

  const handleUnsetImage = () => {
    setFormData({ ...formData, unsetImage: true });
    setFile(null);
  };

  /* init form errors */
  const [formErrors, setFormErrors] = useState({
    nome: "",
  });

  const validateForm = () => {
    const errors = {
      // object to store errors
    };

    if (!formData.nome) errors.nome = "Nome é obrigatório.";

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /* setup form */
  const [formMode, setFormMode] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const dtoToSend = new FormData();
    dtoToSend.append("nome", formData.nome);
    if (file) {
      dtoToSend.append("file", file);
    }
    if (formData.unsetImage) {
      dtoToSend.append("unsetImage", true);
    }

    formMode === "create" ? handleCreate(dtoToSend) : handleUpdate(dtoToSend);
  };

  const hideForm = () => {
    setFormMode(null);
    setFormData({
      nome: "",
    });
    setFile(null);
    setFormErrors({
      nome: "",
    });
    setSelectedCProduto(null);
  };

  /* creating action */
  const [isCreatingAnimation, setIsCreatingAnimation] = useState(false);

  const handleCreate = async (dtoToSend) => {
    try {
      setIsCreatingAnimation(true);
      await create(dtoToSend);
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

  const showUpdate = (cProduto) => {
    setSelectedCProduto(cProduto);
    setFormData({
      nome: cProduto.nome || "",
    });
    setFormMode("update");
  };

  const handleUpdate = async (dtoToSend) => {
    if (!selectedCProduto) return;

    try {
      setIsUpdatingAnimation(true);
      await updateById(selectedCProduto.id, dtoToSend);
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
            {cProdutos.length > 0 && (
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
                          sx={{ textTransform: "capitalize" }}
                        >
                          Editar
                        </Button>
                        <Button
                          color="error"
                          onClick={() => showDelete(cProduto)}
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
                  count={cProdutos.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Stack>
            )}
            {cProdutos.length === 0 && (
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
            <Box
              component="div"
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
              }}
            >
              <FileInput
                placeholder={
                  formMode === "update" && selectedCProduto?.imagemUrl
                    ? selectedCProduto?.imagemUrl
                    : "Selecione uma imagem"
                }
                value={file}
                onChange={handleFileChange}
                disabled={formMode === "update" && formData.unsetImage}
              />
              {selectedCProduto?.imagemUrl && (
                <IconButton
                  aria-label="unset image"
                  onClick={handleUnsetImage}
                  disabled={formMode === "update" && formData.unsetImage}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              O arquivo deve ser uma imagem com no máximo 1MB.
            </Typography>
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
