import {FC} from "react";
import {useNavigate} from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import {EVENT_IMG_URL} from "../helpers/url";
import DataRecord from "./DataRecord";
import {AddCircle, CalendarMonth} from "@mui/icons-material";

interface Props {
  events: {
    id: string;
    name: string;
    date: any;
    description: string;
    mainImage: string;
    commentsCount: number;
    rating: number;
    views: number;
  }[];
  role: string
}

const EventList: FC<Props> = (props) => {
  const {events, role} = props;
  const navigate = useNavigate();
  
  return (
    <Box>
      
      {events.map((event) => (
        <Card key={event.id} sx={{maxWidth: 1, marginY: 5}}>
          <CardMedia
            component="img"
            alt={event.name}
            height="300"
            image={`${EVENT_IMG_URL}${event.id}/${event.mainImage}`}
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {event.name}
            </Typography>
            <Box sx={{display: 'flex', my: 1}}>
              <CalendarMonth sx={{mr: 1}}/><Typography>{event.date}</Typography>
            </Box>
            
            <Typography
              variant="body2"
              color="text.secondary"
              component="div"
              style={{whiteSpace: "pre-line", textAlign: "justify"}}
            >
              {event.description.length >= 450
                ? event.description.substring(0, 450) + "..."
                : event.description}
            </Typography>
          </CardContent>
          <CardActions
            sx={{display: "flex", justifyContent: "space-between"}}
          >
            <Box sx={{display: "flex", width: 1}}>
              <Button size="small">Compartir</Button>
              <Button
                onClick={() => navigate(`/event/${event.id}`)}
                size="small"
              >
                Ver Más...
              </Button>
            </Box>
            
            <DataRecord
              views={event.views}
              rating={event.rating}
              commentsCount={event.commentsCount}
            />
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default EventList;
