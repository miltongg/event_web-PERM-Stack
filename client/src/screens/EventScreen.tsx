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
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Comments from "../components/Comments";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";
import { webApi } from "../helpers/animeApi";
import { CameraAltRounded, Done, Edit } from "@mui/icons-material";
import moment from "moment";
import { StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { EVENT_IMG_URL } from "../helpers/url";
import Carousel from "../components/Carousel";

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

const images = [
  // {
  //   original: "https://picsum.photos/id/1018/1000/600/",
  //   thumbnail: "https://picsum.photos/id/1018/250/150/",
  // },
  // {
  //   original: "https://picsum.photos/id/1015/1000/600/",
  //   thumbnail: "https://picsum.photos/id/1015/250/150/",
  // },
  // {
  //   original: "https://picsum.photos/id/1019/1000/600/",
  //   thumbnail: "https://picsum.photos/id/1019/250/150/",
  // },
];

interface Props {
  userId: string;
  role: string;
  userImg: string | null | undefined;
}

const EventScreen = ({ userId, role, userImg }: Props) => {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const long = 300;
  const [showFullDesc, setShowFullDesc] = useState<boolean>(false);
  const [event, setEvent] = useState<any>({
    id: "",
    name: "",
    date: "",
    description: "",
    commentCount: 0,
    rating: 0,
    mainImage: "",
  });

  const [edit, setEdit] = useState({
    name: false,
    date: false,
    description: false,
    mainImage: false,
  });
  const [date, setDate] = useState(null);
  const [img, setImg] = useState<any>(null);
  const [reload, setReload] = useState(false);

  // GET EVENT //
  useEffect(() => {
    const getEvent = async () => {
      try {
        const { data } = await webApi.get(`/event/${id}`);
        data.date = moment(data.date).format("DD/MM/YYYY");
        setEvent(data);
        setDate(data.date);
      } catch (error) {
        toast.error(getError(error));
      }
    };
    getEvent();
  }, [reload, event.commentsCount]);

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
            "Content-Type": "application/json",
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

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImg(file);
  };

  // UPLOAD IMG
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
              id,
            },
          });

          await webApi.put(
            `/event/${id}`,
            { image: data.image },
            {
              headers: { token },
            }
          );

          toast.success("Se ha actualizado este evento");

          setReload(!reload);
        } catch (error) {
          toast.error(getError(error));
        }
      };

      uploadImg();
    }
  }, [img]);

  return event.id ? (
    <Paper elevation={0} sx={{ marginY: 5 }}>
      <Card sx={{ position: "relative" }}>
        <CardMedia
          image={EVENT_IMG_URL + event.mainImage}
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
              <StaticDatePicker
                sx={{ width: 1 }}
                onChange={(date) => setEvent({ ...event, date: date! })}
                onAccept={handleUpdate}
                onClose={() => setEdit({ ...edit, date: false })}
              />
            </LocalizationProvider>
          ) : (
            <Typography>{date}</Typography>
          )}
          {role === "admin" ? (
            <Edit
              sx={editButtonStyle}
              onClick={() => setEdit({ ...edit, date: !edit.date })}
            />
          ) : (
            ""
          )}
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
                  setEvent({ ...event, description: e.target.value })
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
                    "&:hover": { backgroundColor: "#fcfcfc" },
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
                setEdit({ ...edit, description: !edit.description })
              }
            />
          ) : (
            ""
          )}
        </ListItem>
      </Box>

      <Divider />

      {images.length === 0 ? (
        ""
      ) : (
        <Box sx={{ marginY: 5 }}>
          {/* <Carousel images={images} /> */}
        </Box>
      )}

      <Divider />

      <Comments
        userId={userId}
        token={token}
        commentsCount={event.commentCount}
        userImg={userImg}
        role={role}
      />
    </Paper>
  ) : (
    <CircularProgress />
  );
};

export default EventScreen;
