import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

export default function BasicSelect(props) {
  return (
    <FormControl
      required={props.required}
      fullWidth
      margin="dense"
      variant="standard"
    >
      <InputLabel id={props.labelId || "demo-simple-select-label"}>
        {props.label}
      </InputLabel>
      <Select
        labelId={props.labelId || "demo-simple-select-label"}
        id={props.selectId || "demo-simple-select"}
        value={props.value}
        label={props.label}
        onChange={props.onChange}
      >
        {props.children}
      </Select>
    </FormControl>
  );
}
