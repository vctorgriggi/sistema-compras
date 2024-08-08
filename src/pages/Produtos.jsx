import { Fragment, useState, useEffect } from "react";

import DialogContentText from "@mui/material/DialogContentText";
import TablePagination from "@mui/material/TablePagination";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import StoreIcon from "@mui/icons-material/Store";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import ListItem from "@mui/material/ListItem";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import Box from "@mui/material/Box";

import { get as getCProdutos } from "../services/categoriaDeProdutoService";
import CircularIndeterminate from "../components/CircularIndeterminate";
import { get as getFornecedores } from "../services/fornecedorService";
import AdministrativePanel from "../layouts/AdministrativePanel";
import FeedbackSnackbar from "../components/FeedbackSnackbar";
import BasicTextField from "../components/BasicTextField";
import CancelButton from "../components/button/Cancel";
import DeleteDialog from "../components/DeleteDialog";
import BasicButton from "../components/button/Basic";
import BasicSelect from "../components/BasicSelect";
import SaveButton from "../components/button/Save";
import BasicCard from "../components/BasicCard";
import FileInput from "../components/FileInput";
import {
  add as addProductToSupplier,
  remove as removeProductFromSupplier,
} from "../services/fornecedorProdutoService";
import {
  create,
  get,
  getById,
  updateById,
  deleteById,
} from "../services/produtoService";

export default function Produtos() {
  /* produtos */
  const [produtos, setProdutos] = useState([]);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [isSearchingAnimation, setIsSearchingAnimation] = useState(false);

  async function find() {
    try {
      setIsSearchingAnimation(true);
      const data = await get();
      setProdutos(data);
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

  /* searching product categories */
  const [cProdutos, setCProdutos] = useState([]);
  const [isSearchingCProdutosAnimation, setIsSearchingCProdutosAnimation] =
    useState(false);

  async function findCProdutos() {
    try {
      setIsSearchingCProdutosAnimation(true);
      const data = await getCProdutos();
      setCProdutos(data);
    } catch (error) {
      console.error("Error while fetching product categories:", error.message);
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsSearchingCProdutosAnimation(false);
    }
  }

  useEffect(() => {
    findCProdutos();
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

  const showDelete = (produto) => {
    setSelectedProduto(produto);
    setIsDeleting(true);
  };

  const hideDelete = () => {
    setIsDeleting(false);
    setSelectedProduto(null);
  };

  const handleDelete = async () => {
    if (!selectedProduto) return;

    try {
      setIsDeletingAnimation(true);
      await deleteById(selectedProduto.id);
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
    descricao: "",
    categoriaDeProdutoId: "",
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
    categoriaDeProdutoId: "",
  });

  const validateForm = () => {
    const errors = {
      // object to store errors
    };

    if (!formData.nome) errors.nome = "Nome é obrigatório.";
    if (!formData.categoriaDeProdutoId)
      errors.categoriaDeProdutoId = "Categoria de Produto é obrigatória.";

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
    dtoToSend.append("descricao", formData.descricao);
    dtoToSend.append("categoriaDeProdutoId", formData.categoriaDeProdutoId);
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
      descricao: "",
      categoriaDeProdutoId: "",
    });
    setFile(null);
    setFormErrors({
      nome: "",
      categoriaDeProdutoId: "",
    });
    setSelectedProduto(null);
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

  const showUpdate = (produto) => {
    setSelectedProduto(produto);
    setFormData({
      nome: produto.nome || "",
      descricao: produto.descricao || "",
      categoriaDeProdutoId: produto.categoriaDeProduto?.id || "",
    });
    setFormMode("update");
  };

  const handleUpdate = async (dtoToSend) => {
    if (!selectedProduto) return;

    try {
      setIsUpdatingAnimation(true);
      await updateById(selectedProduto.id, dtoToSend);
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

  /* suppliers dialog */
  const [isFornecedoresDialog, setIsFornecedoresDialog] = useState(false);
  const [isSearchingFPAnimation, setIsSearchingFPAnimation] = useState(false);

  const showFornecedoresDialog = async (produto) => {
    setSelectedProduto(produto);
    setIsFornecedoresDialog(true);
    await handleFornecedores(produto.id);
  };

  const hideFornecedoresDialog = () => {
    setIsFornecedoresDialog(false);
    setSelectedFornecedor("");
    setSelectedProduto(null);
  };

  const handleFornecedores = async (id) => {
    try {
      setIsSearchingFPAnimation(true);
      const data = await getById(id);
      setSelectedProduto(data);
    } catch (error) {
      console.error(
        "Error while fetching suppliers from product:",
        error.message
      );
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsSearchingFPAnimation(false);
    }
  };

  /* delete supplier from product */
  const [isDeletingFPAnimation, setIsDeletingFPAnimation] = useState([]);

  const handleRemoveFornecedor = async (fornecedorId) => {
    if (!selectedProduto) return;

    try {
      setIsDeletingFPAnimation((prev) => [...prev, fornecedorId]);
      await removeProductFromSupplier(selectedProduto.id, fornecedorId);
      const data = await getById(selectedProduto.id);
      setSelectedProduto(data);
      handleOpenSnackbar({
        severity: "success",
        message: "Exclusão bem-sucedida: a associação foi removida.",
      });
    } catch (error) {
      console.error(
        "Error while removing supplier from product:",
        error.message
      );
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsDeletingFPAnimation((prev) =>
        prev.filter((id) => id !== fornecedorId)
      );
    }
  };

  /* add supplier to product */
  const [selectedFornecedor, setSelectedFornecedor] = useState("");
  const [isAddFPAnimation, setIsAddFPAnimation] = useState(false);

  const handleFornecedorChange = (event) => {
    setSelectedFornecedor(event.target.value);
  };

  const handleAddFornecedor = async () => {
    if (!selectedFornecedor || !selectedProduto) return;

    try {
      setIsAddFPAnimation(true);
      await addProductToSupplier(selectedProduto.id, selectedFornecedor);
      const data = await getById(selectedProduto.id);
      setSelectedProduto(data);
      handleOpenSnackbar({
        severity: "success",
        message:
          "Nova associação: a solicitação foi efetuada conforme solicitado.",
      });
    } catch (error) {
      console.error("Error while adding supplier to product:", error.message);
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setSelectedFornecedor("");
      setIsAddFPAnimation(false);
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
            {produtos.length > 0 && (
              <Stack direction="column" spacing={3}>
                {(rowsPerPage > 0
                  ? produtos.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : produtos
                ).map((produto) => (
                  <BasicCard
                    key={produto.id}
                    image={produto.imagemUrl}
                    title={produto.nome}
                    caption={
                      produto.categoriaDeProduto?.nome || "not applicable"
                    }
                    supporting={produto.descricao}
                    actions={
                      <Stack direction="row" spacing={1}>
                        <Button
                          onClick={() => showFornecedoresDialog(produto)}
                          sx={{
                            color: "var(--gray-800)",
                            textTransform: "capitalize",
                          }}
                        >
                          Visualizar fornecedores
                        </Button>
                        <Button
                          onClick={() => showUpdate(produto)}
                          sx={{ textTransform: "capitalize" }}
                        >
                          Editar
                        </Button>
                        <Button
                          color="error"
                          onClick={() => showDelete(produto)}
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
                  count={produtos.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Stack>
            )}
            {produtos.length === 0 && (
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  textTransform: "lowercase",
                }}
              >
                não há produtos cadastrados.
              </Typography>
            )}
          </Fragment>
        )}
      </Stack>
      <Dialog
        open={isFornecedoresDialog}
        onClose={hideFornecedoresDialog}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth
      >
        <DialogTitle id="scroll-dialog-title">
          Fornecedores associados ao produto
        </DialogTitle>
        <DialogContent>
          {isSearchingFPAnimation && <CircularIndeterminate size={24} />}
          {!isSearchingFPAnimation &&
            selectedProduto?.fornecedores?.length > 0 && (
              <List>
                {selectedProduto.fornecedores.map((fornecedor) => (
                  <ListItem
                    key={fornecedor.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveFornecedor(fornecedor.id)}
                        disabled={isDeletingFPAnimation.includes(fornecedor.id)}
                      >
                        {isDeletingFPAnimation.includes(fornecedor.id) && (
                          <CircularIndeterminate size={24} />
                        )}
                        {!isDeletingFPAnimation.includes(fornecedor.id) && (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      <StoreIcon />
                    </ListItemIcon>
                    <ListItemText primary={fornecedor.nome} />
                  </ListItem>
                ))}
              </List>
            )}
          {!isSearchingFPAnimation &&
            !(selectedProduto?.fornecedores?.length > 0) && (
              <DialogContentText>
                Não há fornecedores associados a este produto.
              </DialogContentText>
            )}
          {!isSearchingFPAnimation && (
            <Box component="div" sx={{ m: "1rem 0 0" }}>
              <Box component="div" sx={{ width: "100%" }}>
                <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
                  Gostaria de associar algum fornecedor a este produto?
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <BasicSelect
                  label="Fornecedor"
                  value={selectedFornecedor}
                  onChange={handleFornecedorChange}
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
                <IconButton
                  edge="end"
                  aria-label="to add"
                  onClick={handleAddFornecedor}
                  disabled={isAddFPAnimation}
                >
                  {isAddFPAnimation && <CircularIndeterminate size={24} />}
                  {!isAddFPAnimation && <AddIcon />}
                </IconButton>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={hideFornecedoresDialog} close />
        </DialogActions>
      </Dialog>
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
                gap: 1,
              }}
            >
              <FileInput
                placeholder={
                  formMode === "update" && selectedProduto?.imagemUrl
                    ? selectedProduto?.imagemUrl
                    : "Selecione uma imagem"
                }
                value={file}
                onChange={handleFileChange}
                disabled={formMode === "update" && formData.unsetImage}
              />
              {selectedProduto?.imagemUrl && (
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
            <BasicTextField
              id="descricao"
              name="descricao"
              label="Descrição"
              value={formData.descricao}
              onChange={handleFieldChange}
            />
            <BasicSelect
              required
              name="categoriaDeProdutoId"
              label="Categoria de Produto"
              value={formData.categoriaDeProdutoId}
              onChange={handleFieldChange}
              error={!!formErrors.categoriaDeProdutoId}
              helperText={formErrors.categoriaDeProdutoId}
            >
              {isSearchingCProdutosAnimation && (
                <MenuItem disabled>Loading...</MenuItem>
              )}
              {!isSearchingCProdutosAnimation &&
                cProdutos.map((cProduto) => (
                  <MenuItem key={cProduto.id} value={cProduto.id}>
                    {cProduto.nome}
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
