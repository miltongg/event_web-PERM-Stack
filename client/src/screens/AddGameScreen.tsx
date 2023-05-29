import React, { FormEvent, useState } from "react";
import {
  Box,
  Button,
  Grid,
  ListItem,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { gameTypeList } from "../helpers/tasgList";
import {
  AddCircle,
  MusicNote,
  Photo,
  PhotoAlbumOutlined,
} from "@mui/icons-material";
import { addFormStyle, buttonFormStyle } from "../helpers/customStyles";
import { webApi } from "../helpers/animeApi";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";
import { useNavigate } from "react-router-dom";
import definedConst from "../helpers/definedConst";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const AddGameScreen = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<any>(null);
  const [answerImage, setAnswerImage] = useState<any>(null);
  const [game, setGame] = useState<{
    name: string;
    type: string;
    points: number;
    description: string;
    image: any;
    answerImage: any;
    answer: string;
    music: File | null;
    date: string | null;
  }>({
    name: "",
    type: "",
    points: 100,
    answer: "",
    description: "",
    image: null,
    answerImage: null,
    music: null,
    date: "",
  });
  const navigate = useNavigate();

  const handleSelectGameType = (gameType: string) => {
    gameType === definedConst.GAME_SILHOUETTE
      ? setGame({ ...game, type: gameType, music: null })
      : setGame({
          ...game,
          type: gameType,
          image: null,
        });
  };

  // SELECT IMAGE //
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGame({ ...game, image: e.target.files ? e.target.files[0] : null });
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSelectAnswerImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGame({
      ...game,
      answerImage: e.target.files ? e.target.files[0] : null,
    });
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAnswerImage(e.target?.result);
      reader.readAsDataURL(file);
    }
  };

  // SELECT MUSIC //
  const handleSelectMusic = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGame({ ...game, music: e.target.files ? e.target.files[0] : null });
    // const file = e.target.files && e.target.files[0];
  };

  // SUBMIT //
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    formData.append("date", game.date!);

    formData.append("file1", game.image!);

    formData.append("file2", game.answerImage!);

    try {
      // Post game //
      const { data } = await webApi.post("/game", formData, {
        headers: { token },
      });

      // Upload images to server //
      const image = await webApi.post(
        "/iupload",
        { file: formData.get("file1") },
        {
          headers: {
            token,
            id: data.id,
            "Content-Type": "multipart/form-data",
            prefix: "game",
            folder: "game/",
          },
        }
      );

      const answerImage = await webApi.post(
        "/iupload",
        { file: formData.get("file2") },
        {
          headers: {
            token,
            id: data.id,
            "Content-Type": "multipart/form-data",
            prefix: "game",
            folder: "game/",
          },
        }
      );      

      // Update game img with image name //
      await webApi.put(
        `/game/${data.id}`,
        {
          image: image.data.image,
          answerImage: answerImage.data.image,
        },
        {
          headers: { token },
        }
      );

      toast.success("Juego añadido satisfactoriamente");
      navigate(`/game/${data.id}`);
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  };

  // RENDER //
  return (
    <Paper
      component="form"
      elevation={0}
      onSubmit={handleSubmit}
      sx={addFormStyle}
    >
      <Grid spacing={2} container>
        <Grid item xs={12}>
          <TextField
            label="Nombre"
            value={game.name}
            name="name"
            fullWidth
            required
            onChange={(e) => setGame({ ...game, name: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Juego"
            value={game.type}
            name="type"
            select
            fullWidth
            required
            onChange={(e) => handleSelectGameType(e.target.value)}
          >
            {gameTypeList.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            label="Respuesta"
            name="answer"
            value={game.answer}
            fullWidth
            onChange={(e) => setGame({ ...game, answer: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            label="Puntos"
            name="points"
            type="number"
            value={game.points}
            fullWidth
            onChange={(e) =>
              setGame({ ...game, points: Number(e.target.value) })
            }
          />
        </Grid>

        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
              sx={{ width: 1 }}
              value={game.date}
              onChange={(date) => setGame({ ...game, date: date! })}
              format="DD-MM-YYYY HH:mm"
              label="Fecha límite *"
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Descripción"
            name="description"
            value={game.description}
            multiline
            rows={5}
            fullWidth
            onChange={(e) => setGame({ ...game, description: e.target.value })}
          />
        </Grid>

        <Box>
          {game.image ? (
            <ListItem sx={{ display: "block" }}>
              <img
                src={image}
                alt={game.image?.name}
                style={{ height: 100, borderRadius: 2 }}
              />
              <Typography>{game.image?.name}</Typography>
            </ListItem>
          ) : (
            ""
          )}
          {game.answerImage ? (
            <ListItem sx={{ display: "block" }}>
              <img
                src={answerImage}
                alt={game.answerImage?.name}
                style={{ height: 100, borderRadius: 2 }}
              />
              <Typography>{game.answerImage?.name}</Typography>
            </ListItem>
          ) : (
            ""
          )}
        </Box>
      </Grid>

      {game.type === definedConst.GAME_SILHOUETTE ? (
        <>
          <Button
            startIcon={<Photo />}
            sx={buttonFormStyle}
            variant="contained"
            component="label"
          >
            Seleccionar Imagen de Silueta
            <input
              hidden
              type="file"
              name="file1"
              onChange={handleSelectImage}
            />
          </Button>
          <Button
            startIcon={<PhotoAlbumOutlined />}
            sx={buttonFormStyle}
            variant="contained"
            component="label"
          >
            {" "}
            Seleccionar Imagen de Respuesta
            <input
              hidden
              type="file"
              name="file2"
              onChange={handleSelectAnswerImage}
            />
          </Button>
        </>
      ) : game.type === definedConst.GAME_MUSIC ? (
        <Button
          startIcon={<MusicNote />}
          sx={buttonFormStyle}
          variant="contained"
          component="label"
        >
          Elegir Música
          <input hidden type="file" name="file" onChange={handleSelectMusic} />
        </Button>
      ) : (
        ""
      )}

      <Button
        startIcon={<AddCircle />}
        sx={buttonFormStyle}
        variant="contained"
        type="submit"
      >
        Agregar Juego
      </Button>
    </Paper>
  );
};

export default AddGameScreen;
