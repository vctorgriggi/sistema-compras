import { Link } from "react-router-dom";
import { Fragment } from "react";

import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import ListItemButton from "@mui/material/ListItemButton";
import CategoryIcon from "@mui/icons-material/Category";
import ContactsIcon from "@mui/icons-material/Contacts";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemIcon from "@mui/material/ListItemIcon";
import ReceiptIcon from "@mui/icons-material/Receipt";
import StoreIcon from "@mui/icons-material/Store";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";

export const mainListItems = (
  <Fragment>
    <ListItemButton component={Link} to="/">
      <ListItemIcon>
        <HomeIcon style={{ color: "var(--gray-400)" }} />
      </ListItemIcon>
      <Typography
        sx={{
          color: "var(--gray-400)",
          fontSize: "0.875rem",
          lineHeight: "2rem",
        }}
      >
        Início
      </Typography>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon style={{ color: "var(--gray-400)" }} />
      </ListItemIcon>
      <Typography
        sx={{
          color: "var(--gray-400)",
          fontSize: "0.875rem",
          lineHeight: "2rem",
        }}
      >
        Dashboard
      </Typography>
    </ListItemButton>
  </Fragment>
);

export const secondaryListItems = (
  <Fragment>
    <ListSubheader component="div" inset sx={{ color: "var(--gray-400)" }}>
      Repertórios salvos
    </ListSubheader>
    <ListItemButton component={Link} to="/produtos">
      <ListItemIcon>
        <InventoryIcon style={{ color: "var(--gray-400)" }} />
      </ListItemIcon>
      <Typography
        sx={{
          color: "var(--gray-400)",
          fontSize: "0.875rem",
          lineHeight: "2rem",
        }}
      >
        Produtos
      </Typography>
    </ListItemButton>
    <ListItemButton component={Link} to="/c-produtos">
      <ListItemIcon>
        <CategoryIcon style={{ color: "var(--gray-400)" }} />
      </ListItemIcon>
      <Typography
        sx={{
          color: "var(--gray-400)",
          fontSize: "0.875rem",
          lineHeight: "2rem",
        }}
      >
        Categorias de Produtos
      </Typography>
    </ListItemButton>
    <ListItemButton component={Link} to="/fornecedores">
      <ListItemIcon>
        <StoreIcon style={{ color: "var(--gray-400)" }} />
      </ListItemIcon>
      <Typography
        sx={{
          color: "var(--gray-400)",
          fontSize: "0.875rem",
          lineHeight: "2rem",
        }}
      >
        Fornecedores
      </Typography>
    </ListItemButton>
    <ListItemButton component={Link} to="/contatos">
      <ListItemIcon>
        <ContactsIcon style={{ color: "var(--gray-400)" }} />
      </ListItemIcon>
      <Typography
        sx={{
          color: "var(--gray-400)",
          fontSize: "0.875rem",
          lineHeight: "2rem",
        }}
      >
        Contatos
      </Typography>
    </ListItemButton>
    <ListItemButton component={Link} to="/cotacoes">
      <ListItemIcon>
        <ReceiptIcon style={{ color: "var(--gray-400)" }} />
      </ListItemIcon>
      <Typography
        sx={{
          color: "var(--gray-400)",
          fontSize: "0.875rem",
          lineHeight: "2rem",
        }}
      >
        Cotações
      </Typography>
    </ListItemButton>
  </Fragment>
);
