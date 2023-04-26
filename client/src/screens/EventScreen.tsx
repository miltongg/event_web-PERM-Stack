import {
  Box,
  Card,
  CardMedia,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {ChangeEvent, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Comments from "../components/Comments";
import {toast} from "react-toastify";
import {getError} from "../helpers/handleErrors";
import {webApi} from "../helpers/animeApi";
import {
  CalendarMonth,
  CameraAltRounded,
  Done,
  Edit,
} from "@mui/icons-material";
import moment from "moment";
import {StaticDatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {EVENT_IMG_URL} from "../helpers/url";
import Carousel from "../components/Carousel";
import UploadImages from "../components/UploadImages";
import EventDataRecord from "../components/DataRecord";

const doneButtonStyle = {
  color: "orange",
  "&:hover": {
    color: "red",
    cursor: "pointer",
  },
  "&:active": {
    color: "black",
  },
};

const editButtonStyle = {
  color: "orange",
  ml: 1,
  "&:hover": {
    color: "red",
    cursor: "pointer",
  },
  "&:active": {
    color: "block",
  },
};

interface Props {
  userId: string;
  role: string;
  userImg: string | null | undefined;
}

interface IEvent {
  id: string;
  name: string;
  date: string | object;
  description: string;
  commentsCount: number;
  rating: number;
  views: number;
  mainImage: string;
  eventImages: string[];
}

const EventScreen = ({userId, role, userImg}: Props) => {
  const token = localStorage.getItem("token");
  const {id} = useParams();
  const [showFullDesc, setShowFullDesc] = useState<boolean>(false);
  const [event, setEvent] = useState<IEvent>({
    id: "",
    name: "",
    date: "",
    description: "",
    commentsCount: 0,
    rating: 0,
    views: 0,
    mainImage: "",
    eventImages: [],
  });
  
  const [edit, setEdit] = useState({
    name: false,
    date: false,
    description: false,
    mainImage: false,
  });
  const [img, setImg] = useState<any>(null);
  const [reload, setReload] = useState(false);
  
  // GET EVENT //
  useEffect(() => {
    const getEvent = async () => {
      try {
        const {data} = await webApi.get(`/event/${id}`);
        data.date = moment(data.date).format("DD/MM/YYYY");
        setEvent(data);
        // setDate(data.date);
      } catch (error) {
        toast.error(getError(error));
      }
    };
    getEvent();
  }, []);
  
  // Change reload value //
  const handleActivateReload = () => {
    setReload(!reload);
  };
  
  // UPDATE EVENT //
  const handleUpdate = async () => {
    
    try {
      await webApi.put(
        `/event/${id}`,
        {
          name: event.name,
          date: event.date,
          description: event.description,
        },
        {
          headers: {
            token,
          },
        }
      );
      
      setEdit({
        ...edit,
        name: false,
        date: false,
        description: false,
      });
      
      toast.success("Se ha actualizado este evento");
      
      setReload(!reload);
    } catch (error) {
      toast.error(getError(error));
    }
  };
  
  const updateEventCommentsCount = (number: number) => {
    setEvent({...event, commentsCount: number})
  }
  
  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImg(file);
  };
  
  // UPLOAD IMG //
  useEffect(() => {
    if (img) {
      const uploadImg = async () => {
        let fileData = new FormData();
        fileData.append("file", img);
        
        try {
          const {data} = await webApi.post("/iupload", fileData, {
            headers: {
              token,
              folder: "event/",
              prefix: "event",
              id,
            },
          });
          
          await webApi.put(
            `/event/${id}`,
            {image: data.image},
            {
              headers: {token},
            }
          );
          
          setEvent({...event, mainImage: data.image})
          toast.success("Se ha actualizado este evento");
        } catch (error) {
          toast.error(getError(error));
        }
      };
      
      uploadImg();
    }
  }, [img]);
  
  return event.id ? (
    <Paper elevation={0} sx={{marginY: 5}}>
      <Card sx={{position: "relative"}}>
        <CardMedia
          image={`${EVENT_IMG_URL}${event.id}/${event.mainImage}`}
          component="img"
          alt={event.name}
          height="350"
        />
        <IconButton
          sx={{position: "absolute", zIndex: 2, top: 0, right: 0}}
          aria-label="upload picture"
          component="label"
        >
          <input
            hidden
            type="file"
            name="img"
            id="imgFile"
            onChange={handleImgChange}
          />
          <CameraAltRounded
            sx={{
              color: "black",
              border: "2px solid white",
              backgroundColor: "white",
              borderRadius: "5px",
            }}
          />
        </IconButton>
      </Card>
      <Box sx={{paddingY: 2}}>
        <ListItem>
          {edit?.name ? (
            <>
              <TextField
                inputProps={{style: {fontSize: 34}}}
                InputProps={{style: {fontSize: 34}}}
                fullWidth
                autoFocus={true}
                variant="standard"
                value={event?.name}
                onChange={(e) => setEvent({...event, name: e.target.value})}
              />
              <Done sx={doneButtonStyle} onClick={handleUpdate}/>
            </>
          ) : (
            <Typography variant="h4">{event?.name}</Typography>
          )}
          {role === "admin" ? (
            <Edit
              sx={editButtonStyle}
              onClick={() => setEdit({...edit, name: !edit.name})}
            />
          ) : (
            ""
          )}
        </ListItem>
        <ListItem>
          {edit?.date ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDatePicker
                sx={{width: 1}}
                onChange={(date) => setEvent(
                  {...event, date: moment(date!.toString()).format('DD/MM/YYYY')}
                )}
                onAccept={handleUpdate}
                onClose={() => setEdit({...edit, date: false})}
              />
            </LocalizationProvider>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: 1,
                justifyContent: "space-between",
              }}
            >
              <Box sx={{display: "flex"}}>
                <CalendarMonth/>
                <Typography>{event.date.toString()}</Typography>
                {role === "admin" ? (
                  <Edit
                    sx={editButtonStyle}
                    onClick={() =>
                      setEdit({
                        ...edit,
                        date: !edit.date,
                      })
                    }
                  />
                ) : (
                  ""
                )}
              </Box>
              
              <EventDataRecord
                views={event.views}
                rating={event.rating}
                commentsCount={event.commentsCount}
              />
            </Box>
          )}
        </ListItem>
        
        <Divider sx={{marginY: 2}}/>
        <ListItem sx={{alignItems: "initial"}}>
          {edit?.description ? (
            <>
              <TextField
                inputProps={{style: {fontSize: 16}}}
                InputProps={{style: {fontSize: 16}}}
                fullWidth
                autoFocus={true}
                multiline
                variant="standard"
                value={event?.description}
                onChange={(e) =>
                  setEvent({
                    ...event,
                    description: e.target.value,
                  })
                }
              />
              <Done onClick={handleUpdate} sx={doneButtonStyle}/>
            </>
          ) : (
            <Box
              sx={{cursor: "pointer"}}
              onClick={() => setShowFullDesc(!showFullDesc)}
            >
              <Collapse in={showFullDesc} collapsedSize={85}>
                <Typography
                  component="div"
                  display="block"
                  sx={{
                    whiteSpace: "pre-line",
                    textAlign: "justify",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  {event?.description}
                </Typography>
              </Collapse>
            </Box>
          )}
          
          {role === "admin" ? (
            <Edit
              sx={editButtonStyle}
              onClick={() =>
                setEdit({
                  ...edit,
                  description: !edit.description,
                })
              }
            />
          ) : (
            ""
          )}
        </ListItem>
      </Box>
      
      <Divider/>
      
      {/* Render Carousel */}
      {event.eventImages.length === 0 ? (
        <Typography
          sx={{textAlign: "center", color: "gray", mt: 5}}
          variant="h5"
        >
          No hay imágenes del evento
        </Typography>
      ) : (
        <Box sx={{marginY: 5}}>
          <Carousel images={event.eventImages}/>
        </Box>
      )}
      
      {/* Render Upload ScreenShots */}
      {role === "admin" ? (
        <UploadImages
          eventImages={event.eventImages}
          token={token}
          handleActivateReload={handleActivateReload}
        />
      ) : (
        ""
      )}
      
      {/* Render Comments */}
      <Comments
        userId={userId}
        token={token}
        id={event.id}
        updateEventCommentsCount={updateEventCommentsCount}
        userImg={userImg}
        role={role}
      />
    </Paper>
  ) : (
    <CircularProgress/>
  );
};

export default EventScreen;
