import {AddPhotoAlternate, Image, Delete} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import {FormEvent, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {webApi} from "../helpers/animeApi";
import {toast} from "react-toastify";
import {getError} from "../helpers/handleErrors";
import {EVENT_IMG_URL} from "../helpers/url";

interface Props {
  token: string | null | undefined;
  handleActivateReload: () => void;
  eventImages: string[];
}

const UploadImages = ({token, handleActivateReload, eventImages}: Props) => {
  
  const {id} = useParams();
  const [images, setImages] = useState<any[]>([]);
  const [eventImg, setEventImg] = useState<string[]>([])
  const [showImgToDel, setShowImgToDel] = useState<boolean>(false)
  const [loading, setLoading] = useState(false);
  
  // Set eventImg value //
  useEffect(() => {
    setEventImg(eventImages)
  }, [eventImages])
  
  
  // Select event images to upload //
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
            arrImg.push({file, url: reader.result});
            resolve(null);
          };
        });
      }
      
      setImages(arrImg);
    }
  };
  
  // Delete images from state images //
  const handleDeleteImg = (position: number) => {
    const arrImg = images.filter((n, index) => index !== position);
    setImages(arrImg);
  };
  
  // Delete images from state eventImg //
  const handleDeleteEventImg = (position: number) => {
    const arrImg = eventImg.filter((n, index) => index !== position);
    setEventImg(arrImg);
  };
  
  // Upload images //
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(e.currentTarget);
      
      setLoading(true);
      
      const {data} = await webApi.post("/iuploads", formData, {
        headers: {token, id, folder: "event/", prefix: 'event'},
      });
      
      await webApi.put(
        `/event/${id}`,
        {images: data.images},
        {
          headers: {token},
        }
      );
      
      setImages([]);
      
      handleActivateReload();
      
      setLoading(false);
      
      toast.success("Se han enviado las imágenes correctamente");
    } catch (error) {
      toast.error(getError(error));
    }
  };
  
  // Show images to delete from carousel //
  const handleActivateDel = () => {
    setShowImgToDel(!showImgToDel);
    console.log(eventImages)
    setImages([]);
  }
  
  // Update event images //
  const handleUpdateEventImages = async () => {
    
    try {
      setLoading(true)
      await webApi.put(`/event/${id}`, {
        images: eventImg
      }, {
        headers: {token}
      })
      
      setLoading(false);
      setShowImgToDel(false);
      handleActivateReload();
      toast.success('Evento Actualizado');
    } catch (error: any) {
      toast.error(getError(error));
    }
    
  }
  
  return (
    <Box
      onSubmit={handleSubmit}
      component="form"
      sx={{my: 5, textAlign: "center"}}
    >
      <Button
        startIcon={<Delete/>}
        variant='contained'
        size="small"
        color='error'
        onClick={handleActivateDel}
      >
        Eliminar
      </Button>
      
      <Button
        size="small"
        startIcon={<AddPhotoAlternate/>}
        sx={{mx: 1}}
        variant="contained"
        component="label"
        disabled={showImgToDel}
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
      
      {
        showImgToDel
          ? <Button
            disabled={loading}
            size="small"
            variant="contained"
            endIcon={loading ? <CircularProgress size={15}/> : <Image/>}
            onClick={handleUpdateEventImages}
          >
            Actualizar {eventImg.length}
          </Button>
          : <Button
            disabled={images.length === 0 || loading}
            size="small"
            variant="contained"
            endIcon={loading ? <CircularProgress size={15}/> : <Image/>}
            type="submit"
          >
            Enviar {images.length}
          </Button>
      }
      
      <Box>
        <Box
          sx={{
            width: 1,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {images.map(({file, url}, index) => (
            <Paper elevation={1} key={index} sx={{mx: "auto", mt: 3}}>
              <img
                src={url}
                alt={file.name}
                style={{height: 100, borderRadius: 2}}
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
                  sx={{color: "red", "&:hover": {color: "darkred"}}}
                  onClick={() => handleDeleteImg(index)}
                >
                  <Delete/>
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
      {!showImgToDel ? '' :
        <Box>
          <Box
            sx={{
              width: 1,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {eventImg.map((image, index) => (
              <Paper elevation={1} key={index} sx={{mx: "auto", mt: 3}}>
                <img
                  src={`${EVENT_IMG_URL}${id}/${image}`}
                  alt={'image'}
                  style={{height: 100, borderRadius: 2}}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography>{image}</Typography>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    sx={{color: "red", "&:hover": {color: "darkred"}}}
                    onClick={() => handleDeleteEventImg(index)}
                  >
                    <Delete/>
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      }
    </Box>
  );
};

export default UploadImages;
