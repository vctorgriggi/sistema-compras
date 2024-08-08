import { Fragment, useState, useEffect } from "react";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DialogContentText from "@mui/material/DialogContentText";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TablePagination from "@mui/material/TablePagination";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TableContainer from "@mui/material/TableContainer";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CardContent from "@mui/material/CardContent";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogTitle from "@mui/material/DialogTitle";
import TableFooter from "@mui/material/TableFooter";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import CircularIndeterminate from "../components/CircularIndeterminate";
import { get as getFornecedores } from "../services/fornecedorService";
import AdministrativePanel from "../layouts/AdministrativePanel";
import { get as getProdutos } from "../services/produtoService";
import FeedbackSnackbar from "../components/FeedbackSnackbar";
import BasicTextField from "../components/BasicTextField";
import CancelButton from "../components/button/Cancel";
import DeleteDialog from "../components/DeleteDialog";
import BasicButton from "../components/button/Basic";
import BasicSelect from "../components/BasicSelect";
import SaveButton from "../components/button/Save";
import {
  create,
  get,
  updateById,
  deleteById,
} from "../services/cotacaoService";

dayjs.locale("pt-br");

/* table settings */
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function Cotacoes() {
  /* cotações */
  const [cotacoes, setCotacoes] = useState([]);
  const [selectedCotacao, setSelectedCotacao] = useState(null);
  const [isSearchingAnimation, setIsSearchingAnimation] = useState(false);

  async function find() {
    try {
      setIsSearchingAnimation(true);
      const data = await get();
      setCotacoes(data);
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

  /* searching products */
  const [produtos, setProdutos] = useState([]);
  const [isSearchingProdutosAnimation, setIsSearchingProdutosAnimation] =
    useState(false);

  async function findProdutos() {
    try {
      setIsSearchingProdutosAnimation(true);
      const data = await getProdutos();
      setProdutos(data);
    } catch (error) {
      console.error("Error while fetching products:", error.message);
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsSearchingProdutosAnimation(false);
    }
  }

  useEffect(() => {
    findProdutos();
  }, []);

  /* utils */
  const formatDate = (date, withTime = false) => {
    if (!date) {
      return "not applicable";
    }

    const fmtDate = withTime ? "lll" : "ll";

    return dayjs(date).format(fmtDate);
  };

  const brlValue = (value) => {
    if (!value) {
      return "not applicable";
    }

    const fmtValue = parseFloat(value);

    if (isNaN(fmtValue)) {
      return "Invalid value.";
    }

    return fmtValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  /* deleting action */
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingAnimation, setIsDeletingAnimation] = useState(false);

  const showDelete = (cotacao) => {
    setSelectedCotacao(cotacao);
    setIsDeleting(true);
  };

  const hideDelete = () => {
    setIsDeleting(false);
    setSelectedCotacao(null);
  };

  const handleDelete = async () => {
    if (!selectedCotacao) return;

    try {
      setIsDeletingAnimation(true);
      await deleteById(selectedCotacao.id);
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
    validade: null,
    quantidade: "",
    valor: "",
    observacao: "",
    fornecedorId: "",
    produtoId: "",
  });

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleDateChange = (event) => {
    setFormData({ ...formData, validade: event });
  };

  /* init form errors */
  const [formErrors, setFormErrors] = useState({
    quantidade: "",
    valor: "",
    fornecedorId: "",
    produtoId: "",
  });

  const validateForm = () => {
    const errors = {
      // object to store errors
    };

    if (!formData.quantidade) errors.quantidade = "Quantidade é obrigatório.";
    if (!formData.valor) errors.valor = "Valor total é obrigatório.";
    if (!formData.fornecedorId)
      errors.fornecedorId = "Fornecedor é obrigatório.";
    if (!formData.produtoId) errors.produtoId = "Produto é obrigatório.";

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
      validade: null,
      quantidade: "",
      valor: "",
      observacao: "",
      fornecedorId: "",
      produtoId: "",
    });
    setFormErrors({
      quantidade: "",
      valor: "",
      fornecedorId: "",
      produtoId: "",
    });
    setSelectedCotacao(null);
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

  const showUpdate = (cotacao) => {
    setSelectedCotacao(cotacao);
    setFormData({
      validade: cotacao.validade ? dayjs(cotacao.validade) : null, // dayjs sempre retorna uma instância de data, mesmo que vazia
      quantidade: cotacao.quantidade || "",
      valor: cotacao.valor || "",
      observacao: cotacao.observacao || "",
      fornecedorId: cotacao.fornecedor?.id || "",
      produtoId: cotacao.produto?.id || "",
    });
    setFormMode("update");
  };

  const handleUpdate = async () => {
    if (!selectedCotacao) return;

    try {
      setIsUpdatingAnimation(true);
      await updateById(selectedCotacao.id, formData);
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

  /* see details */
  const [isDetails, setIsDetails] = useState(false);

  const showDetails = (cotacao) => {
    setSelectedCotacao(cotacao);
    setIsDetails(true);
  };

  const hideDetails = () => {
    setIsDetails(false);
    setSelectedCotacao(null);
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

  /* filters */
  const [filteredCotacoes, setFilteredCotacoes] = useState([]);
  const [produtoFilter, setProdutoFilter] = useState("");

  const handleFilterClick = () => {
    const filterCotacoes = cotacoes.filter((cotacao) =>
      produtoFilter ? cotacao.produtoId === produtoFilter : true
    );

    setFilteredCotacoes(filterCotacoes);
  };

  useEffect(() => {
    setFilteredCotacoes(cotacoes);
  }, [cotacoes]);

  /* table pagination */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - filteredCotacoes.length)
      : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <AdministrativePanel>
      <Stack direction="column" spacing={4}>
        <Box component="div" sx={{ width: "100%" }}>
          <BasicButton onClick={() => setFormMode("create")} />
        </Box>
        <Card sx={{ paddingX: { xs: 2, md: 0 } }}>
          <CardHeader title="Filtros" />
          <CardContent>
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
              autoComplete="off"
            >
              <BasicSelect
                label="Produto"
                value={produtoFilter}
                onChange={(event) => setProdutoFilter(event.target.value)}
              >
                {isSearchingProdutosAnimation && (
                  <MenuItem disabled>Loading...</MenuItem>
                )}
                {!isSearchingProdutosAnimation && [
                  <MenuItem key="all" value="">
                    All
                  </MenuItem>,
                  produtos.map((produto) => (
                    <MenuItem key={produto.id} value={produto.id}>
                      {produto.nome}
                    </MenuItem>
                  )),
                ]}
              </BasicSelect>
              <BasicButton onClick={handleFilterClick}>Submeter</BasicButton>
            </Box>
          </CardContent>
        </Card>
        {isSearchingAnimation && <CircularIndeterminate />}
        {!isSearchingAnimation && (
          <Fragment>
            {cotacoes.length > 0 && (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Ações</StyledTableCell>
                      <StyledTableCell align="left">
                        Data da Cotação
                      </StyledTableCell>
                      <StyledTableCell align="left">Fornecedor</StyledTableCell>
                      <StyledTableCell align="left">Produto</StyledTableCell>
                      <StyledTableCell align="left">Validade</StyledTableCell>
                      <StyledTableCell align="left">Quantidade</StyledTableCell>
                      <StyledTableCell align="left">
                        Valor Total
                      </StyledTableCell>
                      <StyledTableCell align="left">Observação</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? filteredCotacoes.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : filteredCotacoes
                    ).map((cotacao) => (
                      <StyledTableRow key={cotacao.id}>
                        <StyledTableCell component="th" scope="row">
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              aria-label="details"
                              onClick={() => showDetails(cotacao)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton
                              aria-label="edit"
                              onClick={() => showUpdate(cotacao)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              onClick={() => showDelete(cotacao)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {formatDate(cotacao.createdAt, true)}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {cotacao.fornecedor?.nome || "not applicable"}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {cotacao.produto?.nome || "not applicable"}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {formatDate(cotacao.validade)}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {cotacao.quantidade}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {brlValue(cotacao.valor)}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {cotacao.observacao
                            ? "Clique no ícone de visualização para ver a observação."
                            : "Não há observações."}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[
                          5,
                          10,
                          25,
                          { label: "All", value: -1 },
                        ]}
                        // colSpan={3}
                        count={cotacoes.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            )}
            {cotacoes.length === 0 && (
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  textTransform: "lowercase",
                }}
              >
                não há cotações cadastradas.
              </Typography>
            )}
          </Fragment>
        )}
      </Stack>
      <Dialog open={isDetails} onClose={hideDetails} scroll="paper" fullWidth>
        <DialogTitle>Detalhes da Cotação</DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={1}>
            <Box component="div">
              <Typography variant="caption" gutterBottom>
                Data da Cotação
              </Typography>
              <Typography variant="subtitle2">
                {formatDate(selectedCotacao?.createdAt, true)}
              </Typography>
            </Box>
            <Box component="div">
              <Typography variant="caption" gutterBottom>
                Fornecedor
              </Typography>
              <Typography variant="subtitle2">
                {selectedCotacao?.fornecedor?.nome || "not applicable"}
              </Typography>
            </Box>
            <Box component="div">
              <Typography variant="caption" gutterBottom>
                Produto
              </Typography>
              <Typography variant="subtitle2">
                {selectedCotacao?.produto?.nome || "not applicable"}
              </Typography>
            </Box>
            {selectedCotacao?.validade && (
              <Box component="div">
                <Typography variant="caption" gutterBottom>
                  Validade
                </Typography>
                <Typography variant="subtitle2">
                  {formatDate(selectedCotacao?.validade)}
                </Typography>
              </Box>
            )}
            <Box component="div">
              <Typography variant="caption" gutterBottom>
                Quantidade
              </Typography>
              <Typography variant="subtitle2">
                {selectedCotacao?.quantidade}
              </Typography>
            </Box>
            <Box component="div">
              <Typography variant="caption" gutterBottom>
                Valor Total
              </Typography>
              <Typography variant="subtitle2">
                {brlValue(selectedCotacao?.valor)}
              </Typography>
            </Box>
            {selectedCotacao?.observacao && (
              <Box component="div">
                <Typography variant="caption" gutterBottom>
                  Observação
                </Typography>
                <Typography variant="subtitle2">
                  {selectedCotacao?.observacao}
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={hideDetails} close />
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
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="pt-br"
            >
              <DatePicker
                label="Validade"
                value={formData.validade}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    margin: "dense",
                    fullWidth: true,
                    variant: "standard",
                  },
                }}
              />
            </LocalizationProvider>
            <BasicTextField
              required
              id="quantidade"
              name="quantidade"
              label="Quantidade"
              type="tel"
              value={formData.quantidade}
              onChange={handleFieldChange}
              error={!!formErrors.quantidade}
              helperText={formErrors.quantidade}
            />
            <BasicTextField
              required
              id="valor"
              name="valor"
              label="Valor Total"
              type="tel"
              value={formData.valor}
              onChange={handleFieldChange}
              error={!!formErrors.valor}
              helperText={formErrors.valor}
            />
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Caso necessário, utilize o ponto (.) para separar as casas
              decimais ao informar valores.
            </Typography>
            <BasicTextField
              id="observacao"
              name="observacao"
              label="Observação"
              multiline
              rows={4}
              value={formData.observacao}
              onChange={handleFieldChange}
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
            <BasicSelect
              required
              name="produtoId"
              label="Produto"
              value={formData.produtoId}
              onChange={handleFieldChange}
              error={!!formErrors.produtoId}
              helperText={formErrors.produtoId}
            >
              {isSearchingProdutosAnimation && (
                <MenuItem disabled>Loading...</MenuItem>
              )}

              {!isSearchingProdutosAnimation &&
                produtos.map((produto) => (
                  <MenuItem key={produto.id} value={produto.id}>
                    {produto.nome}
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
