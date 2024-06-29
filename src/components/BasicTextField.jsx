import TextField from "@mui/material/TextField";

export default function BasicTextField(props) {
  return (
    <TextField
      required={props.required}
      id={props.id}
      label={props.label}
      name={props.name}
      fullWidth
      margin="dense"
      variant="standard"
      type={props.type || "text"}
      value={props.value}
      onChange={props.onChange}
      autoFocus={props.autoFocus}
      autoComplete={props.autoComplete || "off"}
    />
  );
}
