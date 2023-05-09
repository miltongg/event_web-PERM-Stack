import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const gameList = [
  {
    title: "Adivina la silueta",
    description:
      "Adivina la silueta de las imagenes, demuestra tu conocimiento",
    img: "/game-imgs/silhouette-img.png",
    link: '/games/discover-the-silhouette'
  },
  {
    title: "Adivina la música",
    description:
      "Prepara bien los oidos para descubrir a que anime o videojuego pertenece el fragmento de la música",
    img: "/game-imgs/music-girl.jpg",
    link: '/games/discover-the-music'
  },
];

const GamesScreen = () => {

  const navigate = useNavigate()

  return (
    <Box sx={{ mt: 5 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {gameList.map(({ title, description, img, link }) => (
          <Grid item xs={2} sm={4} md={4}>
            <Card
              sx={{
                maxWidth: 345,
                "&:hover": { boxShadow: "10", cursor: "pointer" },
              }}
              onClick={() => navigate(link)}
            >
              <CardMedia component="img" alt="img" height="140" image={img} />
              <CardContent>
                <Typography gutterBottom variant="h5" textAlign="center">
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GamesScreen;
