import {
  AddCircle,
  AddPhotoAlternate,
  Image,
  PermMedia,
} from "@mui/icons-material";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  ListItem,
  CircularProgress,
} from "@mui/material";
import React, { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { webApi } from "../helpers/animeApi";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";
import { DatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

interface Props {
  id: string;
}

const AddEventScreen = ({ id }: Props) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(null);
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    console.log(mainImage?.name, "imagen");
  }, [mainImage]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    formData.append("date", date!); // agregar la fecha en formato ISO

    // data.append('file', mainImage as File); // Agrega la imagen principal al
    // data.append('files', eventImages as FileList)

    try {
      // Post event //
      const { data } = await webApi.post("/event", formData, {
        headers: { token },
      });

      // Upload image to server //
      const image = await webApi.post("/iupload", formData, {
        headers: { token, id: data.id, prefix: "event", folder: "event/" },
      });

      // Update event img with image name //
      await webApi.put(`/event/${data.slug}`, image.data, {
        headers: { token },
      });

      toast.success("Evento añadido satisfactoriamente");
      navigate(`/event/${data.slug}`);
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  };

  return (
    <Paper
      component="form"
      sx={{ padding: 2, marginY: 5 }}
      onSubmit={handleSubmit}
    >
      <Typography
        sx={{ textAlign: "center", color: "#555" }}
        variant="h5"
        gutterBottom
      >
        Añadir Evento
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            name="name"
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              sx={{ width: 1 }}
              value={date}
              onChange={(date) => setDate(date!)}
              format="DD-MM-YYYY"
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            name="description"
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            startIcon={<AddPhotoAlternate />}
            variant="contained"
            component="label"
          >
            Subir imagen principal
            <input
              type="file"
              name="file"
              hidden
              onChange={(e) =>
                setMainImage(e.target.files ? e.target.files[0] : null)
              }
            />
          </Button>
          {mainImage ? (
            <ListItem>
              <Image />
              <Typography>{mainImage?.name}</Typography>
            </ListItem>
          ) : (
            ""
          )}
        </Grid>

        <Grid item xs={12}>
          <Button
            startIcon={
              !loading ? <AddCircle /> : <CircularProgress size={20} />
            }
            disabled={loading}
            type="submit"
            variant="contained"
            color="primary"
          >
            Agregar evento
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AddEventScreen;
