import {
  Box,
  Card,
  CardMedia,
  Collapse,
  Divider,
  IconButton,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Comments from "../components/Comments";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";
import { webApi } from "../helpers/animeApi";
import {
  CalendarMonth,
  CameraAltRounded,
  Done,
  Edit,
} from "@mui/icons-material";

import moment from "moment";

import { StaticDateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { EVENT_IMG_URL } from "../helpers/url";
import Carousel from "../components/Carousel";
import UploadImages from "../components/UploadImages";
import EventDataRecord from "../components/DataRecord";
import unidecode from "unidecode";
import Loading from "../components/Loading";
import { IEvent } from "../interfaces/interfaces";

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

const EventScreen = ({ userId, role, userImg }: Props) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { slug } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [showFullDesc, setShowFullDesc] = useState<boolean>(false);
  const [event, setEvent] = useState<IEvent>({
    id: "",
    name: "",
    slug: "",
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

  // GET EVENT //
  useEffect(() => {
    const getEvent = async () => {
      try {
        const { data } = await webApi.get(`/event/${slug}`);

        data.date = moment(data.date).format("DD/MM/YYYY - hh:mm A");
        console.log(data);
        setEvent(data);
        setLoading(false);
      } catch (error) {
        navigate("/event");
        toast.error(getError(error));
      }
    };
    getEvent();
  }, []);

  // UPDATE EVENT //
  const handleUpdate = async () => {
    setLoading(true);

    try {
      await webApi.put(
        `/event/${slug}`,
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

      if (event.name) {
        const slug = unidecode(event.name)
          .replace(/[^a-zA-Z0-9]/g, "-")
          .toLowerCase();

        navigate(`/event/${slug}`);
      }

      setLoading(false);
      toast.success("Se ha actualizado este evento");
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  };

  //// UPDATE STATE FUNCTIONS ////
  const updateCommentsCount = (operation: string) => {
    setEvent({
      ...event,
      commentsCount:
        operation === "sum"
          ? Number(event.commentsCount) + 1
          : Number(event.commentsCount) - 1,
    });
  };

  const updateRating = (rating: number) => {
    setEvent({ ...event, rating });
  };

  const updateEventImages = (images: string[]) => {
    setEvent({ ...event, eventImages: images });
  };

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
          const { data } = await webApi.post("/iupload", fileData, {
            headers: {
              token,
              folder: "event/",
              prefix: "event",
              id: event.id,
            },
          });

          // UPDATE EVENT IMAGE //
          await webApi.put(
            `/event/${slug}`,
            { image: data.image },
            {
              headers: { token },
            }
          );

          setEvent({ ...event, mainImage: data.image });
          toast.success("Se ha actualizado este evento");
        } catch (error) {
          toast.error(getError(error));
        }
      };

      uploadImg();
    }
  }, [img]);

  return loading ? (
    <Loading />
  ) : (
    <Paper elevation={0} sx={{ marginY: 5 }}>
      <Card sx={{ position: "relative" }}>
        <CardMedia
          image={`${EVENT_IMG_URL}${event.id}/${event.mainImage}`}
          component="img"
          alt={event.name}
          height="350"
        />
        <IconButton
          sx={{ position: "absolute", zIndex: 2, top: 0, right: 0 }}
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
      <Box sx={{ paddingY: 2 }}>
        <ListItem>
          {edit?.name ? (
            <>
              <TextField
                inputProps={{ style: { fontSize: 34 } }}
                InputProps={{ style: { fontSize: 34 } }}
                fullWidth
                autoFocus={true}
                variant="standard"
                value={event?.name}
                onChange={(e) => setEvent({ ...event, name: e.target.value })}
              />
              <Done sx={doneButtonStyle} onClick={handleUpdate} />
            </>
          ) : (
            <Typography variant="h4">{event?.name}</Typography>
          )}
          {role === "admin" ? (
            <Edit
              sx={editButtonStyle}
              onClick={() => setEdit({ ...edit, name: !edit.name })}
            />
          ) : (
            ""
          )}
        </ListItem>
        <ListItem>
          {edit?.date ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDateTimePicker
                sx={{ width: 1 }}
                onChange={(date) =>
                  setEvent({
                    ...event,
                    date: moment(date!.toString()).format(
                      "DD/MM/YYYY - hh:mm A"
                    ),
                  })
                }
                onAccept={handleUpdate}
                onClose={() => setEdit({ ...edit, date: false })}
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
              <Box sx={{ display: "flex", width: 1 }}>
                <CalendarMonth />
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
            </Box>
          )}
          <EventDataRecord
            views={event.views}
            rating={event.rating}
            commentsCount={event.commentsCount}
          />
        </ListItem>

        <Divider sx={{ marginY: 2 }} />
        <ListItem sx={{ alignItems: "initial" }}>
          {edit?.description ? (
            <>
              <TextField
                inputProps={{ style: { fontSize: 16 } }}
                InputProps={{ style: { fontSize: 16 } }}
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
              <Done onClick={handleUpdate} sx={doneButtonStyle} />
            </>
          ) : (
            <Box
              sx={{ cursor: "pointer" }}
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

      <Divider />

      {/* Render Carousel */}
      {event.eventImages.length === 0 ? (
        <Typography
          sx={{ textAlign: "center", color: "gray", mt: 5 }}
          variant="h5"
        >
          No hay imágenes del evento
        </Typography>
      ) : (
        <Box sx={{ marginY: 5 }}>
          <Carousel images={event.eventImages} id={event.id} />
        </Box>
      )}

      {/* Render Upload ScreenShots */}
      {role === "admin" ? (
        <UploadImages
          id={event.id}
          eventImages={event.eventImages}
          token={token}
          updateEventImages={updateEventImages}
        />
      ) : (
        ""
      )}

      {/* Render Comments */}
      <Comments
        userId={userId}
        token={token}
        id={event.id}
        updateCommentsCount={updateCommentsCount}
        updateRating={updateRating}
        userImg={userImg}
        role={role}
      />
    </Paper>
  );
};

export default EventScreen;
