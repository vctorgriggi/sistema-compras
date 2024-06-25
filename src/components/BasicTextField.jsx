import TextField from "@mui/material/TextField";

export default function BasicTextField(props) {
  return (
    <TextField
      required={props.required}
      margin="dense"
      id={props.id}
      name={props.name}
      label={props.label}
      type={props.type || "text"}
      fullWidth
      variant="standard"
      value={props.value}
      onChange={props.onChange}
      autoComplete={props.autoComplete || "off"}
      autoFocus={props.autoFocus}
    />
  );
}
