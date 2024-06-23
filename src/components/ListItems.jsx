import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListSubheader from "@mui/material/ListSubheader";
import Typography from "@mui/material/Typography";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import StoreIcon from "@mui/icons-material/Store";
import ContactsIcon from "@mui/icons-material/Contacts";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { Link } from "react-router-dom";

export const mainListItems = (
  <React.Fragment>
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
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
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
  </React.Fragment>
);
