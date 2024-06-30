import * as React from "react";

import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Logout from "@mui/icons-material/Logout";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

import { AuthenticationContext } from "../context/AuthenticationContext";
import { removeStorageItem } from "../utils/local-storage";

export default function AccountMenu() {
  /* AuthContext user handling */
  const { setUser } = React.useContext(AuthenticationContext);

  const handleLogout = () => {
    setUser(null);
    removeStorageItem("@user:accessToken");
    handleClose();
  };

  /* mui settings */
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Ajustes da conta">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>S</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Avatar />
          </ListItemIcon>
          <Typography
            sx={{
              color: "var(--gray-400)",
              fontSize: "1rem",
              lineHeight: "2rem",
            }}
          >
            Perfil
          </Typography>
        </MenuItem>
        <Divider /> */}
        <MenuItem component={Link} to="/sign-in" onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <Typography
            sx={{
              color: "var(--gray-400)",
              fontSize: "1rem",
              lineHeight: "2rem",
            }}
          >
            Sair
          </Typography>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
