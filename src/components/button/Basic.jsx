import Button from "@mui/material/Button";

export default function Basic(props) {
  return (
    <Button
      variant="contained"
      type={props.type}
      onClick={props.onClick}
      sx={{
        textTransform: "capitalize",
      }}
    >
      {props.children || "Criar novo item"}
    </Button>
  );
}
