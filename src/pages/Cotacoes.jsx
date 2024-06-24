import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/pt-br";
import dayjs from "dayjs";

import AdministrativePanel from "../layouts/AdministrativePanel";
import {
  create,
  get,
  updateById,
  deleteById,
} from "../services/cotacaoService";
import Create from "../components/button/Create";
import DeleteDialog from "../components/DeleteDialog";
import Save from "../components/button/Save";
import Cancel from "../components/button/Cancel";
import FeedbackSnackbar from "../components/FeedbackSnackbar";
import CircularIndeterminate from "../components/CircularIndeterminate";
import { get as getFornecedores } from "../services/fornecedorService";
import { get as getProdutos } from "../services/produtoService";

/**
 *
 */
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
  const [cotacoes, setCotacoes] = React.useState([]);
  const [selectedCotacao, setSelectedCotacao] = React.useState(null);
  const [isSearchingAnimation, setIsSearchingAnimation] = React.useState(false);

  async function find() {
    try {
      setIsSearchingAnimation(true);
      const data = await get();
      setCotacoes(data);
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
  const [produtos, setProdutos] = React.useState([]);
  const [isProdutosSearchingAnimation, setIsProdutosSearchingAnimation] =
    React.useState(false);

  async function findProdutos() {
    try {
      setIsProdutosSearchingAnimation(true);
      const data = await getProdutos();
      setProdutos(data);
    } catch (error) {
      console.error(`error while fetching produtos: ${error.message}`);
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsProdutosSearchingAnimation(false);
    }
  }

  React.useEffect(() => {
    findProdutos();
  }, []);

  /**
   *
   */
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

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
  const fnsDate = (date) => {
    const utcDate = new Date(date);
    utcDate.setMinutes(utcDate.getMinutes() + utcDate.getTimezoneOffset());
    return format(utcDate, "PP", { locale: ptBR });
  };

  const brlValue = (value) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  /**
   *
   */
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isDeletingAnimation, setIsDeletingAnimation] = React.useState(false);

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
    validade: null,
    quantidade: "",
    valor: "",
    fornecedorId: "",
    produtoId: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (event) => {
    setFormData({ ...formData, validade: event });
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
      validade: null,
      quantidade: "",
      valor: "",
      fornecedorId: "",
      produtoId: "",
    });
    setSelectedCotacao(null);
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

  const showUpdate = (cotacao) => {
    setSelectedCotacao(cotacao);
    setFormData({
      validade: cotacao.validade ? dayjs(cotacao.validade) : null, // dayjs sempre retorna uma instância de data, mesmo que vazia
      quantidade: cotacao.quantidade || "",
      valor: cotacao.valor || "",
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

  /**
   *
   */
  const [produtoFilter, setProdutoFilter] = React.useState("");

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
        <Box component="div">
          <FormControl margin="dense" fullWidth variant="standard">
            <InputLabel id="produto-filter-label">Produto</InputLabel>
            <Select
              labelId="produto-filter-label"
              id="produto-filter"
              value={produtoFilter}
              label="Produto"
              onChange={(event) => setProdutoFilter(event.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {produtos.map((produto) => (
                <MenuItem key={produto.id} value={produto.id}>
                  {produto.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {isSearchingAnimation ? (
          <CircularIndeterminate />
        ) : (
          <>
            {cotacoes.length > 0 ? (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Ações</StyledTableCell>
                      <StyledTableCell align="left">Fornecedor</StyledTableCell>
                      <StyledTableCell align="left">Produto</StyledTableCell>
                      <StyledTableCell align="left">Validade</StyledTableCell>
                      <StyledTableCell align="left">Quantidade</StyledTableCell>
                      <StyledTableCell align="left">
                        Valor Total
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? cotacoes
                          .filter((cotacao) =>
                            produtoFilter
                              ? cotacao.produtoId === produtoFilter
                              : true
                          )
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                      : cotacoes.filter((cotacao) =>
                          produtoFilter
                            ? cotacao.produtoId === produtoFilter
                            : true
                        )
                    ).map((cotacao) => (
                      <StyledTableRow key={cotacao.id}>
                        <StyledTableCell component="th" scope="row">
                          <Stack direction="row" spacing={1}>
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
                          {cotacao.fornecedor?.nome || "not applicable"}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {cotacao.produto?.nome || "not applicable"}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {fnsDate(cotacao.validade)}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {cotacao.quantidade}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {brlValue(cotacao.valor)}
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
            ) : (
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
            <TextField
              required
              margin="dense"
              id="name"
              name="quantidade"
              label="Quantidade"
              type="tel"
              fullWidth
              variant="standard"
              value={formData.quantidade}
              onChange={handleInputChange}
            />
            <TextField
              required
              margin="dense"
              id="name"
              name="valor"
              label="Valor Total"
              type="tel"
              fullWidth
              variant="standard"
              value={formData.valor}
              onChange={handleInputChange}
            />
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Caso necessário, utilize o ponto (.) para separar as casas
              decimais ao informar valores.
            </Typography>
            <FormControl required margin="dense" fullWidth variant="standard">
              <InputLabel id="demo-simple-select-label">Fornecedor</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.fornecedorId}
                label="Fornecedor"
                onChange={(event) =>
                  setFormData({ ...formData, fornecedorId: event.target.value })
                }
              >
                {fornecedores.map((fornecedor) => (
                  <MenuItem key={fornecedor.id} value={fornecedor.id}>
                    {fornecedor.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl required margin="dense" fullWidth variant="standard">
              <InputLabel id="demo-simple-select-label">Produto</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.produtoId}
                label="produto"
                onChange={(event) =>
                  setFormData({ ...formData, produtoId: event.target.value })
                }
              >
                {produtos.map((produto) => (
                  <MenuItem key={produto.id} value={produto.id}>
                    {produto.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
