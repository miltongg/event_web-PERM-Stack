import { FC } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { EVENT_IMG_URL } from "../helpers/url";

interface Props {
  events: {
    id: string;
    name: string;
    date: any;
    description: string;
    mainImage: string;
  }[];
}

const EventList: FC<Props> = (props) => {
  const { events } = props;
  const navigate = useNavigate();

  return (
    <Box>
      {events.map(({ id, name, date, description, mainImage }) => (
        <Card key={id} sx={{ maxWidth: 1, marginY: 5 }}>
          <CardMedia
            component="img"
            alt={name}
            height="300"
            image={EVENT_IMG_URL + mainImage}
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {name}
            </Typography>
            <Typography gutterBottom>{date}</Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              component="div"
              style={{ whiteSpace: "pre-line", textAlign: 'justify' }}
            >
              {description.length >= 450
                ? description.substring(0, 450) + "..."
                : description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Compartir</Button>
            <Button onClick={() => navigate(`event/${id}`)} size="small">
              Ver Más...
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default EventList;
