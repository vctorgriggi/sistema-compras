import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularIndeterminate from "./CircularIndeterminate";

import Cancel from "./button/Cancel";

export default function DeleteDialog(props) {
  return (
    <Dialog
      open={props.open}
      onClose={props.onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">Você tem certeza?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Você realmente deseja excluir este dado? Esse processo não pode ser
          desfeito.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Cancel onClick={props.onCancel} />
        <Button
          variant="contained"
          color="error"
          onClick={props.onConfirm}
          disabled={props.isDeletingAnimation}
          sx={{
            minWidth: "150px",
            textTransform: "capitalize",
          }}
        >
          {props.isDeletingAnimation ? (
            <CircularIndeterminate size={25} color="inherit" />
          ) : (
            "Sim, excluir"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
