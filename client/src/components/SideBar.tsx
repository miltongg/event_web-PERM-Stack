import {
  Backdrop,
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { webApi } from "../helpers/animeApi";
import moment from "moment/moment";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";
import Loading from "./Loading";
import { IEvent } from "../interfaces/interfaces";
import { EVENT_IMG_URL, NEWS_IMG_URL } from "../helpers/url";
import { Link } from "react-router-dom";

export const SideBar = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [news, setNews] = useState([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const getData = async () => {
        let events = await webApi("/event", {
          headers: { limit: 3, offset },
        });

        let news = await webApi("/news", {
          headers: { limit: 3, offset },
        });

        const { eventsList } = events.data;
        const { newsList } = news.data;

        for (let element of eventsList) {
          element.date = moment(element.date).format("DD/MM/YYYY");
        }
        for (let element of newsList) {
          element.date = moment(element.date).format("DD/MM/YYYY");
        }
        setEvents(eventsList);
        setNews(newsList);
        setLoading(false);
      };

      getData();
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  }, []);

  return (
    <Box sx={{ marginY: 5 }}>
      <Divider variant="middle" textAlign="left">
        <Typography variant="h6" color="gray">
          Últimos Eventos
        </Typography>
      </Divider>
      {/*<Divider/>*/}
      {/*{loading ? (*/}
      {/*  <Backdrop open={loading} sx={{ zIndex: 1 }}>*/}
      {/*    <Loading />*/}
      {/*  </Backdrop>*/}
      {/*) : (*/}
      {/*  ""*/}
      {/*)}*/}
      {!loading && events?.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: "center", my: 3 }}>
          No hay eventos que mostrar
        </Typography>
      ) : (
        events.map((event) => (
          <Card
            component={Link}
            to={`/event/${event.slug}`}
            key={event.id}
            sx={{
              display: "flex",
              my: 3,
              textDecoration: "none",
              "&:hover": {
                boxShadow: "5",
              },
            }}
          >
            <CardMedia
              component="img"
              sx={{ width: 100 }}
              image={`${EVENT_IMG_URL}${event.id}/${event.mainImage}`}
              alt={event.name}
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography component="div" variant="h6">
                  {event.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                  sx={{ fontSize: "12px" }}
                >
                  {event.description.substring(0, 60)}
                  {event.description.length > 60 ? "..." : ""}
                </Typography>
              </CardContent>
            </Box>
          </Card>
        ))
      )}
      <Divider variant="middle" textAlign="left">
        <Typography variant="h6" color="gray">
          Últimas Noticias
        </Typography>
      </Divider>
      {!loading && events?.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: "center", mt: 3 }}>
          No hay noticias que mostrar
        </Typography>
      ) : (
        news.map((n: any) => (
          <Card
            component={Link}
            to={`/news/${n.slug}`}
            key={n.id}
            sx={{
              display: "flex",
              my: 3,
              textDecoration: "none",
              "&:hover": {
                boxShadow: "5",
              },
            }}
          >
            <CardMedia
              component="img"
              sx={{ width: 100 }}
              image={`${NEWS_IMG_URL}${n.id}/${n.mainImage}`}
              alt={n.name}
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography component="div" variant="h6">
                  {n.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                  sx={{ fontSize: "12px" }}
                >
                  {n.description.substring(0, 60)}
                  {n.description.length > 60 ? "..." : ""}
                </Typography>
              </CardContent>
            </Box>
          </Card>
        ))
      )}
    </Box>
  );
};
