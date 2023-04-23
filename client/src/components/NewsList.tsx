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
import { NEWS_IMG_URL } from "../helpers/url";
import DataRecord from "./DataRecord";
import { CalendarMonth } from "@mui/icons-material";

interface Props {
  news: {
    id: string;
    name: string;
    date: any;
    description: string;
    mainImage: string;
    slug: string;
    commentsCount: number;
    views: number;
  }[];
  role: string;
}

const NewsList: FC<Props> = (props) => {
  const { news, role } = props;
  const navigate = useNavigate();

  return (
    <Box>
      {news.map((n) => (
        <Card key={n.id} sx={{ maxWidth: 1, marginY: 5 }}>
          <CardMedia
            component="img"
            alt={n.name}
            height="300"
            image={`${NEWS_IMG_URL}${n.id}/${n.mainImage}`}
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {n.name}
            </Typography>
            <Box sx={{ display: "flex", my: 1 }}>
              <CalendarMonth sx={{ mr: 1 }} />
              <Typography>{n.date}</Typography>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              component="div"
              style={{ whiteSpace: "pre-line", textAlign: "justify" }}
            >
              {n.description.length >= 450
                ? n.description.substring(0, 450) + "..."
                : n.description}
            </Typography>
          </CardContent>
          <CardActions
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Box sx={{ display: "flex", width: 1 }}>
              <Button size="small">Compartir</Button>
              <Button onClick={() => navigate(`/news/${n.slug}`)} size="small">
                Ver Más...
              </Button>
            </Box>

            <DataRecord
              views={n.views}
              commentsCount={n.commentsCount}
            />
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default NewsList;
