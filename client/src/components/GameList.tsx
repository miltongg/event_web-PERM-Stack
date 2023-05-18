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
import DataRecord from "./DataRecord";
import { CalendarMonth } from "@mui/icons-material";

interface Props {
  games: {
    id: string;
    name: string;
    date: any;
    description: string;
    image: string;
    rating: number;
    points: number;
    // commentsCount: number;
    views: number;
  }[];
  role: string | null;
}

const GameList: FC<Props> = (props) => {
  const { games, role } = props;
  const navigate = useNavigate();

  return (
    <Box>
      {games.map((game) => (
        <Card key={game.id} sx={{ maxWidth: 1, mb: 5 }}>
          <CardMedia
            component="img"
            alt={game.name}
            height="300"
            // image={`${NEWS_IMG_URL}${n.id}/${n.mainImage}`}
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {game.name}
            </Typography>
            <Box sx={{ display: "flex", my: 1 }}>
              <CalendarMonth sx={{ mr: 1 }} />
              <Typography>{game.date}</Typography>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              component="div"
              style={{ whiteSpace: "pre-line", textAlign: "justify" }}
            >
              {game.description.length >= 450
                ? game.description.substring(0, 450) + "..."
                : game.description}
            </Typography>
          </CardContent>
          <CardActions
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Box sx={{ display: "flex", width: 1 }}>
              <Button size="small">Compartir</Button>
              <Button
                onClick={() =>
                  navigate(`/games/discover-the-silhouette/${game.id}`)
                }
                size="small"
              >
                Ver Más...
              </Button>
            </Box>

            {/*<DataRecord*/}
            {/*  views={game.views}*/}
            {/*  // commentsCount={game.commentsCount}*/}
            {/*/>*/}
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default GameList;
