import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TablePagination from "@mui/material/TablePagination";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import StoreIcon from "@mui/icons-material/Store";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Divider from "@mui/material/Divider";

import AdministrativePanel from "../layouts/AdministrativePanel";
import {
  create,
  get,
  getById,
  updateById,
  deleteById,
} from "../services/produtoService";
import Basic from "../components/button/Basic";
import BasicCard from "../components/BasicCard";
import DeleteDialog from "../components/DeleteDialog";
import Save from "../components/button/Save";
import Cancel from "../components/button/Cancel";
import FeedbackSnackbar from "../components/FeedbackSnackbar";
import CircularIndeterminate from "../components/CircularIndeterminate";
import { get as getCProdutos } from "../services/categoriaDeProdutoService";
import { get as getFornecedores } from "../services/fornecedorService";
import {
  add as addProductToSupplier,
  remove as removeProductFromSupplier,
} from "../services/fornecedorProdutoService";
import BasicTextField from "../components/BasicTextField";
import BasicSelect from "../components/BasicSelect";

export default function Produtos() {
  const [produtos, setProdutos] = React.useState([]);
  const [selectedProduto, setSelectedProduto] = React.useState(null);
  const [isSearchingAnimation, setIsSearchingAnimation] = React.useState(false);

  async function find() {
    try {
      setIsSearchingAnimation(true);
      const data = await get();
      setProdutos(data);
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

  /**
   *
   */
  const [cProdutos, setCProdutos] = React.useState([]);
  const [isCProdutosSearchingAnimation, setIsCProdutosSearchingAnimation] =
    React.useState(false);

  async function findCProdutos() {
    try {
      setIsCProdutosSearchingAnimation(true);
      const data = await getCProdutos();
      setCProdutos(data);
    } catch (error) {
      console.error(
        `error while fetching categorias de produtos: ${error.message}`
      );
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsCProdutosSearchingAnimation(false);
    }
  }

  React.useEffect(() => {
    findCProdutos();
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
    descricao: "",
    categoriaDeProdutoId: "",
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
      descricao: "",
      categoriaDeProdutoId: "",
    });
    setSelectedProduto(null);
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

  const showUpdate = (produto) => {
    setSelectedProduto(produto);
    setFormData({
      nome: produto.nome || "",
      imagemUrl: produto.imagemUrl || "",
      descricao: produto.descricao || "",
      categoriaDeProdutoId: produto.categoriaDeProduto?.id || "",
    });
    setFormMode("update");
  };

  const handleUpdate = async () => {
    if (!selectedProduto) return;

    try {
      setIsUpdatingAnimation(true);
      await updateById(selectedProduto.id, formData);
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
  const [isFornecedoresProdutosVisible, setIsFornecedoresProdutosVisible] =
    React.useState(false);
  const [isFPSearchingAnimation, setIsFPSearchingAnimation] =
    React.useState(false);

  const showFornecedoresProdutos = async (produto) => {
    try {
      setIsFornecedoresProdutosVisible(true);
      setIsFPSearchingAnimation(true);
      const data = await getById(produto.id);
      setSelectedProduto(data);
    } catch (error) {
      console.error(
        `error while fetching fornecedor-produto associations: ${error.message}`
      );
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsFPSearchingAnimation(false);
    }
  };

  const hideFornecedoresProdutos = () => {
    setIsFornecedoresProdutosVisible(false);
    setSelectedFornecedor("");
    setSelectedProduto(null);
  };

  /**
   *
   */
  const [isFPDeletingAnimation, setIsFPDeletingAnimation] =
    React.useState(false);

  const handleRemoveFP = async (fornecedorId) => {
    if (!selectedProduto) return;

    try {
      setIsFPDeletingAnimation(true);
      await removeProductFromSupplier(selectedProduto.id, fornecedorId);
      const data = await getById(selectedProduto.id);
      setSelectedProduto(data);
      handleOpenSnackbar({
        severity: "success",
        message: "Exclusão bem-sucedida: a associação foi removida.",
      });
    } catch (error) {
      console.error(
        `error while removing fornecedor-produto association: ${error.message}`
      );
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsFPDeletingAnimation(false);
    }
  };

  /**
   *
   */
  const [selectedFornecedor, setSelectedFornecedor] = React.useState("");
  const [isFPAddAnimation, setIsFPAddAnimation] = React.useState(false);

  const handleFornecedorChange = (event) => {
    setSelectedFornecedor(event.target.value);
  };

  const handleAddFP = async () => {
    if (!selectedFornecedor || !selectedProduto) return;

    try {
      setIsFPAddAnimation(true);
      await addProductToSupplier(selectedProduto.id, selectedFornecedor);
      const data = await getById(selectedProduto.id);
      setSelectedProduto(data);
      handleOpenSnackbar({
        severity: "success",
        message:
          "Nova associação: a solicitação foi efetuada conforme solicitado.",
      });
    } catch (error) {
      console.error(
        `error while adding fornecedor-produto association: ${error.message}`
      );
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setSelectedFornecedor("");
      setIsFPAddAnimation(false);
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
        {isSearchingAnimation ? (
          <CircularIndeterminate />
        ) : (
          <>
            {produtos.length > 0 ? (
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
                    subtitle={`${
                      produto.categoriaDeProduto?.nome || "not applicable"
                    }`}
                    description={produto.descricao}
                    actions={
                      <Stack direction="row" spacing={1}>
                        <Button
                          onClick={() => showFornecedoresProdutos(produto)}
                          sx={{
                            color: "var(--gray-800)",
                            textTransform: "capitalize",
                          }}
                        >
                          Visualizar fornecedores
                        </Button>
                        <Button
                          onClick={() => showUpdate(produto)}
                          sx={{
                            textTransform: "capitalize",
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          color="error"
                          onClick={() => showDelete(produto)}
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
                  count={produtos.length}
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
                não há produtos cadastrados.
              </Typography>
            )}
          </>
        )}
      </Stack>

      {/**
       *
       */}
      <Dialog
        open={isFornecedoresProdutosVisible}
        onClose={hideFornecedoresProdutos}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth
      >
        <DialogTitle id="scroll-dialog-title">
          Fornecedores associados ao produto
        </DialogTitle>
        <DialogContent>
          {isFPSearchingAnimation ? (
            <CircularIndeterminate size={25} />
          ) : selectedProduto?.fornecedores?.length > 0 ? (
            <List>
              {selectedProduto.fornecedores.map((fornecedor) => (
                <ListItem
                  key={fornecedor.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveFP(fornecedor.id)}
                      disabled={isFPDeletingAnimation}
                    >
                      {isFPDeletingAnimation ? (
                        <CircularIndeterminate size={25} />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <StoreIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={fornecedor.nome}
                    // secondary={""}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <DialogContentText>
              Não há fornecedores associados a este produto.
            </DialogContentText>
          )}
          {!isFPSearchingAnimation && (
            <Box
              component="div"
              sx={{
                margin: "1rem 0 0",
              }}
            >
              <Divider>
                Gostaria de associar algum fornecedor a este produto?
              </Divider>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <BasicSelect
                  label="Fornecedor"
                  value={selectedFornecedor}
                  onChange={handleFornecedorChange}
                >
                  {isFornecedoresSearchingAnimation ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : (
                    fornecedores.map((fornecedor) => (
                      <MenuItem key={fornecedor.id} value={fornecedor.id}>
                        {fornecedor.nome}
                      </MenuItem>
                    ))
                  )}
                </BasicSelect>
                <IconButton
                  edge="end"
                  aria-label="to add"
                  onClick={handleAddFP}
                  disabled={isFPAddAnimation}
                >
                  {isFPAddAnimation ? (
                    <CircularIndeterminate size={25} />
                  ) : (
                    <AddIcon />
                  )}
                </IconButton>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Cancel onClick={hideFornecedoresProdutos} close />
        </DialogActions>
      </Dialog>

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
              id="name"
              name="imagemUrl"
              label="Imagem"
              value={formData.imagemUrl}
              onChange={handleInputChange}
            />
            <BasicTextField
              id="name"
              name="descricao"
              label="Descrição"
              value={formData.descricao}
              onChange={handleInputChange}
            />
            <BasicSelect
              required
              label="Categoria de Produto"
              value={formData.categoriaDeProdutoId}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  categoriaDeProdutoId: event.target.value,
                })
              }
            >
              {isCProdutosSearchingAnimation ? (
                <MenuItem disabled>Loading...</MenuItem>
              ) : (
                cProdutos.map((cProduto) => (
                  <MenuItem key={cProduto.id} value={cProduto.id}>
                    {cProduto.nome}
                  </MenuItem>
                ))
              )}
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
