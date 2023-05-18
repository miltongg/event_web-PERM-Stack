import React, { FormEvent, useState } from "react";
import {
  Button,
  Grid,
  ListItem,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { gameTypeList } from "../helpers/tasgList";
import { AddCircle, MusicNote, Photo } from "@mui/icons-material";
import { addFormStyle, buttonFormStyle } from "../helpers/customStyles";
import { webApi } from "../helpers/animeApi";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";
import { useNavigate } from "react-router-dom";
import definedConst from "../helpers/definedConst";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker, MobileDateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import moment from "moment";

const AddGameScreen = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<any>(null);
  const [game, setGame] = useState<{
    name: string;
    type: string;
    points: number;
    description: string;
    image: any;
    music: File | null;
    date: string | null;
  }>({
    name: "",
    type: "",
    points: 100,
    description: "",
    image: null,
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

    try {
      // Post game //
      const { data } = await webApi.post("/game", formData, {
        headers: { token },
      });

      console.log(data);

      // Upload image to server //
      const image = await webApi.post("/iupload", formData, {
        headers: { token, id: data.id, prefix: "game", folder: "game/" },
      });

      // Update game img with image name //
      await webApi.put(`/game/${data.id}`, image.data, {
        headers: { token },
      });

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
              label="Fecha límite"
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
      </Grid>

      {game.type === definedConst.GAME_SILHOUETTE ? (
        <Button
          startIcon={<Photo />}
          sx={buttonFormStyle}
          variant="contained"
          component="label"
        >
          Elegir Imagen
          <input hidden type="file" name="file" onChange={handleSelectImage} />
        </Button>
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
