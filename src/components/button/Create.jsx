import Button from "@mui/material/Button";

export default function Create(props) {
  return (
    <Button
      variant="contained"
      onClick={props.onClick}
      sx={{
        textTransform: "capitalize",
      }}
    >
      Criar novo item
    </Button>
  );
}
