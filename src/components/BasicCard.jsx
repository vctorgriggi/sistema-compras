import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";

export default function BasicCard(props) {
  return (
    <Card sx={{ minWidth: 275 }}>
      {props.image && (
        <CardMedia
          component="img"
          // alt=""
          height="210" // default 140
          image={props.image}
        />
      )}
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {props.label}
        </Typography>
        <Typography variant="h5" component="div">
          {props.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {props.subtitle}
        </Typography>
        <Typography variant="body2">{props.description}</Typography>
      </CardContent>
      <CardActions>{props.actions}</CardActions>
    </Card>
  );
}
