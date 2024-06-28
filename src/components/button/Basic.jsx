import Button from "@mui/material/Button";

export default function Basic(props) {
  return (
    <Button
      variant="contained"
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      fullWidth={props.fullWidth}
      sx={{
        textTransform: "capitalize",
        ...props.sx,
      }}
    >
      {props.children || "Criar novo item"}
    </Button>
  );
}
