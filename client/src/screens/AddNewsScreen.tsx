import React, { FormEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  ListItem,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { webApi } from "../helpers/animeApi";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { AddPhotoAlternate, Image, Send } from "@mui/icons-material";
import { newsTagList } from "../helpers/tasgList";
import { addFormStyle, buttonFormStyle } from "../helpers/customStyles";
import zIndex from "@mui/material/styles/zIndex";

interface Props {
  id: string;
}

const AddNewsScreen = ({ id }: Props) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [tag, setTag] = useState("");
  const [date, setDate] = useState(null);
  const [image, setImage] = useState<any>(null);
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    formData.append("date", date!); // agregar la fecha en formato ISO

    try {
      // Post event //
      const { data } = await webApi.post("/news", formData, {
        headers: { token },
      });

      // Upload image to server //
      const image = await webApi.post("/iupload", formData, {
        headers: { token, id: data.id, prefix: "news", folder: "news/" },
      });

      // Update event img with image name //
      await webApi.put(`/news/${data.slug}`, image.data, {
        headers: { token },
      });

      toast.success("Noticia añadida satisfactoriamente");
      navigate(`/news/${data.slug}`);
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  };

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMainImage(e.target.files ? e.target.files[0] : null);
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Paper
      component="form"
      elevation={0}
      sx={addFormStyle}
      onSubmit={handleSubmit}
    >
      <Typography
        sx={{ textAlign: "center", color: "#555" }}
        variant="h5"
        gutterBottom
      >
        Añadir Noticia
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
          <TextField
            required
            name="subtitle"
            label="Subtítulo"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            name="tag"
            label="Categoría"
            select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            fullWidth
          >
            {newsTagList.map(({ value, label, divider }, index) => (
              <MenuItem
                sx={{ p: 1 }}
                divider={index !== newsTagList.length - 1}
                key={value}
                value={value}
              >
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              sx={{ width: 1 }}
              value={date}
              onChange={(date) => setDate(date!)}
              format="DD-MM-YYYY"
              label="Fecha *"
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            name="description"
            label="Noticia"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={8}
          />
        </Grid>
      </Grid>
      <Button
        startIcon={<AddPhotoAlternate />}
        sx={buttonFormStyle}
        variant="contained"
        component="label"
      >
        Seleccionar imagen
        <input type="file" name="file" hidden onChange={handleSelectImage} />
      </Button>
      {image ? (
        <ListItem sx={{ display: "block" }}>
          <img
            src={image}
            alt={mainImage?.name}
            style={{ height: 100, borderRadius: 2 }}
          />
          <Typography>{mainImage?.name}</Typography>
        </ListItem>
      ) : (
        ""
      )}

      <Button
        startIcon={!loading ? <Send /> : <CircularProgress size={20} />}
        sx={buttonFormStyle}
        disabled={loading}
        type="submit"
        variant="contained"
      >
        Agregar noticia
      </Button>
    </Paper>
  );
};

export default AddNewsScreen;
