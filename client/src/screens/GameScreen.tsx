import {
  Box,
  Card,
  CardMedia,
  Collapse,
  Divider,
  IconButton,
  ListItem,
  Chip,
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
import { GAME_IMG_URL } from "../helpers/url";
import EventDataRecord from "../components/DataRecord";
import Loading from "../components/Loading";

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
  userId?: string;
  role?: string;
  userImg?: string | null | undefined;
}

const GameScreen = ({ userId, role, userImg }: Props) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  // const { slug } = useParams();
  const { id } = useParams();

  const [showFullDesc, setShowFullDesc] = useState<boolean>(false);
  const [game, setGame] = useState<{
    id: string;
    name: string;
    date: Date | null | string;
    points: number;
    answer: string;
    description: string;
    commentsCount: number;
    rating: number;
    views: number;
    image: File | string;
    answerImage: File | string;
    usersId: string[];
  }>({
    id: "",
    name: "",
    date: "",
    points: 0,
    answer: "",
    description: "",
    commentsCount: 0,
    rating: 0,
    views: 0,
    image: "",
    answerImage: "",
    usersId: [],
  });

  const [edit, setEdit] = useState({
    name: false,
    date: false,
    description: false,
    mainImage: false,
  });
  const [img, setImg] = useState<any>(null);
  const [reload, setReload] = useState(false);

  // GET GAME //
  useEffect(() => {
    const getEvent = async () => {
      try {
        const { data } = await webApi.get(`/game/${id}`);

        // data.date = moment(data.date).format("DD/MM/YYYY - hh:mm A");
        setGame(data);
      } catch (error) {
        navigate("/event");
        toast.error(getError(error));
      }
    };
    getEvent();
  }, []);

  // UPDATE GAME //
  const handleUpdate = async () => {
    try {
      await webApi.put(
        `/game/${id}`,
        {
          name: game.name,
          date: game.date,
          description: game.description,
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

      // if (game.name) {
      //   const slug = unidecode(game.name)
      //     .replace(/[^a-zA-Z0-9]/g, "-")
      //     .toLowerCase();
      //
      //   navigate(`/game/${id}`);
      // }

      toast.success("Se ha actualizado este juego");
    } catch (error) {
      toast.error(getError(error));
    }
  };

  // UPDATE STATE FUNCTIONS //
  const updateCommentsCount = (operation: string) => {
    setGame({
      ...game,
      commentsCount:
        operation === "sum"
          ? Number(game.commentsCount) + 1
          : Number(game.commentsCount) - 1,
    });
  };

  const updateRating = (rating: number) => {
    setGame({ ...game, rating });
  };

  const updateGameUsersId = () => {
    setGame({
      ...game,
      usersId: [...game.usersId, userId!],
    });
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
              folder: "game/",
              prefix: "game",
              id: game.id,
            },
          });

          // UPDATE GAME IMAGE //
          await webApi.put(
            `/game/${id}`,
            { image: data.image },
            {
              headers: { token },
            }
          );

          setGame({ ...game, image: data.image });
          toast.success("Se ha actualizado este juego");
        } catch (error) {
          toast.error(getError(error));
        }
      };

      uploadImg();
    }
  }, [img]);

  return game.id ? (
    <Paper elevation={0} sx={{ marginY: 5 }}>
      <Box sx={{ position: "relative" }}>
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <img
            src={`${GAME_IMG_URL}${game.id}/${game.image}`}
            alt={game.name}
            style={{height: '400px'}}
          />
        </Box>

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
      </Box>
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
                value={game?.name}
                onChange={(e) => setGame({ ...game, name: e.target.value })}
              />
              <Done sx={doneButtonStyle} onClick={handleUpdate} />
            </>
          ) : (
            <Typography variant="h4">{game?.name}</Typography>
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
                onChange={(date: any) =>
                  setGame({
                    ...game,
                    date: date?.toISOString(),
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
                <Typography>
                  {moment(game.date).format("DD/MM/YYYY - hh:mm A")}
                </Typography>
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
                views={game.views}
                rating={game.rating}
                commentsCount={game.commentsCount}
              />
            </Box>
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
                value={game?.description}
                onChange={(e) =>
                  setGame({
                    ...game,
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
                  {game?.description}
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

      {/* Render Comments */}

      {new Date().toISOString() >= game.date! ? (
        <Box>
          <Box sx={{ position: "relative", display: 'flex', justifyContent: 'center' }}>
            <img
              src={`${GAME_IMG_URL}${game.id}/${game.answerImage}`}
              alt={game.name}
              style={{height: "400px"}}
            />
          </Box>
          <ListItem sx={{ display: "flex", justifyContent: "center" }}>
            <Typography>La respuesta es: &nbsp;</Typography>
            <Chip
              sx={{ fontSize: 25, p: 2 }}
              color="success"
              label={game.answer}
            />
          </ListItem>
        </Box>
      ) : (
        ""
      )}

      <Comments
        userId={userId}
        usersId={game.usersId}
        token={token}
        dateEnd={game?.date}
        id={game.id}
        answer={game?.answer}
        points={game?.points}
        updateRating={updateRating}
        updateCommentsCount={updateCommentsCount}
        updateGameUsersId={updateGameUsersId}
        userImg={userImg}
        role={role}
      />
    </Paper>
  ) : (
    <Loading />
  );
};

export default GameScreen;
