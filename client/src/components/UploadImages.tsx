import { AddPhotoAlternate, Image, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { webApi } from "../helpers/animeApi";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";

interface Props {
  token: string | null | undefined;
}

const UploadImages = ({ token }: Props) => {
  const { id } = useParams();

  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelectImages = async (e: any) => {
    const files = e.target.files;

    if (files.length !== 0) {
      const arrImg: any[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        await new Promise((resolve) => {
          reader.readAsDataURL(file);
          reader.onload = () => {
            arrImg.push({ file, url: reader.result });
            resolve(null);
          };
        });
      }

      setImages(arrImg);
    }
  };

  // Delete img from list //
  const handleDeleteImg = (position: number) => {
    const arrImg = images.filter((n, index) => index !== position);
    setImages(arrImg);
  };

  // Upload images //
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);

      setLoading(true);

      const { data } = await webApi.post("/iuploads", formData, {
        headers: { token, id, folder: "event/", prefix: 'event' },
      });

      await webApi.put(
        `/event/${id}`,
        { images: data.images },
        {
          headers: { token },
        }
      );

      setImages([]);

      setLoading(false);

      toast.success("Se han enviado las imágenes correctamente");
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <Box
      onSubmit={handleSubmit}
      component="form"
      sx={{ my: 5, textAlign: "center" }}
    >
      <Button
        size="small"
        startIcon={<AddPhotoAlternate />}
        variant="contained"
        component="label"
      >
        Seleccionar fotos
        <input
          type="file"
          name="file"
          multiple
          hidden
          onChange={handleSelectImages}
        />
      </Button>
      <Button
        disabled={images.length === 0 || loading ? true : false}
        size="small"
        sx={{ ml: 1 }}
        variant="contained"
        endIcon={loading ? <CircularProgress size={15} /> : <Image />}
        type="submit"
      >
        Enviar {images.length}
      </Button>
      <Box>
        <Box
          sx={{
            width: 1,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {images.map(({ file, url }, index) => (
            <Paper elevation={1} key={index} sx={{ mx: "auto", mt: 3 }}>
              <img
                src={url}
                alt={file.name}
                style={{ height: 100, borderRadius: 2 }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography>{file.name}</Typography>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  sx={{ color: "red", "&:hover": { color: "darkred" } }}
                  onClick={() => handleDeleteImg(index)}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default UploadImages;
