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
import { NEWS_IMG_URL } from "../helpers/url";
import {
  CalendarMonth,
  CameraAltRounded,
  Done,
  Edit,
} from "@mui/icons-material";
import { webApi } from "../helpers/animeApi";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DataRecord from "../components/DataRecord";
import { doneButtonStyle, editButtonStyle } from "../helpers/customStyles";
import Comments from "../components/Comments";
import unidecode from "unidecode";
import Loading from "../components/Loading";

interface Props {
  userId: string;
  role: string;
  userImg: string | null | undefined;
}

interface INews {
  id: string;
  name: string;
  subtitle: string;
  slug: string;
  description: string;
  tag: string;
  userId: string;
  mainImage: string;
  date: string | {};
  views: number;
  commentsCount: number;
}

const NewsScreen = ({ role, userId, userImg }: Props) => {
  const token = localStorage.getItem("token");
  const { slug } = useParams();
  const [showFullDesc, setShowFullDesc] = useState<boolean>(false);
  const navigate = useNavigate();

  const [edit, setEdit] = useState({
    name: false,
    date: false,
    subtitle: false,
    tag: false,
    description: false,
    mainImage: false,
  });
  const [img, setImg] = useState<any>(null);
  const [reload, setReload] = useState(false);

  const [news, setNews] = useState<INews>({
    id: "",
    name: "",
    subtitle: "",
    slug: "",
    date: "",
    tag: "",
    userId: "",
    description: "",
    commentsCount: 0,
    views: 0,
    mainImage: "",
  });

  // GET NEWS //
  useEffect(() => {
    const getNews = async () => {
      try {
        const { data } = await webApi.get(`/news/${slug}`);
        data.date = moment(data.date).format("DD/MM/YYYY");
        setNews(data);
      } catch (error) {
        navigate('/news')
        toast.error(getError(error));
      }
    };
    getNews();
  }, [reload]);

  // UPDATE NEWS //
  const handleUpdate = async () => {
    try {
      await webApi.put(
        `/news/${slug}`,
        {
          name: news.name,
          date: news.date,
          subtitle: news.subtitle,
          tag: news.tag,
          description: news.description,
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
        subtitle: false,
        tag: false,
        description: false,
      });

      if (news.name) {
        const slug = unidecode(news.name)
          .replace(/[^a-zA-Z0-9]/g, "-")
          .toLowerCase();

        navigate(`/news/${slug}`);
      }

      setReload(!reload);
    } catch (error) {
      toast.error(getError(error));
    }
  };

  const updateCommentsCount = (number: number) => {
    setNews({ ...news, commentsCount: number });
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
              folder: "news/",
              prefix: "news",
              id: news.id,
            },
          });

          await webApi.put(
            `/news/${slug}`,
            { image: data.image },
            {
              headers: { token },
            }
          );

          setNews({ ...news, mainImage: data.image });
          toast.success("Se ha actualizado esta noticia");
        } catch (error) {
          toast.error(getError(error));
        }
      };

      uploadImg();
    }
  }, [img]);

  return news.id ? (
    <Paper elevation={0} sx={{ my: 5 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        {edit?.name ? (
          <>
            <TextField
              inputProps={{ style: { fontSize: 34 } }}
              InputProps={{ style: { fontSize: 34 } }}
              fullWidth
              autoFocus={true}
              variant="standard"
              value={news?.name}
              onChange={(e) => setNews({ ...news, name: e.target.value })}
            />
            <Done sx={doneButtonStyle} onClick={handleUpdate} />
          </>
        ) : (
          <Typography variant="h4">{news?.name}</Typography>
        )}
        {role === "admin" ? (
          <Edit
            sx={editButtonStyle}
            onClick={() => setEdit({ ...edit, name: !edit.name })}
          />
        ) : (
          ""
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        {edit?.subtitle ? (
          <>
            <TextField
              inputProps={{ style: { fontSize: 20 } }}
              InputProps={{ style: { fontSize: 20 } }}
              fullWidth
              autoFocus={true}
              variant="standard"
              value={news?.subtitle}
              onChange={(e) => setNews({ ...news, subtitle: e.target.value })}
            />
            <Done sx={doneButtonStyle} onClick={handleUpdate} />
          </>
        ) : (
          <Typography variant="h6" sx={{ color: "gray" }}>
            {news?.subtitle}
          </Typography>
        )}
        {role === "admin" ? (
          <Edit
            sx={editButtonStyle}
            onClick={() => setEdit({ ...edit, subtitle: !edit.subtitle })}
          />
        ) : (
          ""
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        {edit?.date ? (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              sx={{ width: 1 }}
              onChange={(date) =>
                setNews({
                  ...news,
                  date: moment(date!.toString()).format("DD/MM/YYYY"),
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
            <Box sx={{ display: "flex" }}>
              <CalendarMonth />
              <Typography>{news.date.toString()}</Typography>
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

            <DataRecord views={news.views} commentsCount={news.commentsCount} />
          </Box>
        )}
      </Box>
      <Card sx={{ position: "relative" }}>
        <CardMedia
          image={`${NEWS_IMG_URL}${news.id}/${news.mainImage}`}
          component="img"
          alt={news.name}
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
        <Divider sx={{ marginY: 2 }} />
        <Box sx={{ alignItems: "initial", display: "flex" }}>
          {edit?.description ? (
            <>
              <TextField
                inputProps={{ style: { fontSize: 16 } }}
                InputProps={{ style: { fontSize: 16 } }}
                fullWidth
                autoFocus={true}
                multiline
                variant="standard"
                value={news?.description}
                onChange={(e) =>
                  setNews({
                    ...news,
                    description: e.target.value,
                  })
                }
              />
              <Done onClick={handleUpdate} sx={doneButtonStyle} />
            </>
          ) : (
            <Typography
              component="div"
              display="block"
              sx={{
                whiteSpace: "pre-line",
                textAlign: "justify",
              }}
            >
              {news?.description}
            </Typography>
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
        </Box>
      </Box>

      {/* Render Comments */}
      <Comments
        userId={userId}
        token={token}
        updateCommentsCount={updateCommentsCount}
        id={news.id}
        userImg={userImg}
        role={role}
      />
    </Paper>
  ) : (
    <Loading />
  );
};

export default NewsScreen;
