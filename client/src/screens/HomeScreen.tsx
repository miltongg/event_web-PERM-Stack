import {
  Backdrop,
  Box,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import moment from "moment";
import { webApi } from "../helpers/animeApi";
import { useState, useEffect } from "react";
import { getError } from "../helpers/handleErrors";
import { toast } from "react-toastify";
import EventList from "../components/EventList";
import Loading from "../components/Loading";
import NewsList from "../components/NewsList";

interface Props {
  role?: string | null;
}

const HomeScreen = ({ role }: Props) => {
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const getData = async () => {
        let events = await webApi("/event", {
          headers: { limit, offset },
        });

        let news = await webApi("/news", {
          headers: { limit, offset },
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
    <>
      {loading ? (
        <Backdrop open={loading} sx={{ zIndex: 1 }}>
          <Loading />
        </Backdrop>
      ) : (
        ""
      )}
      {!loading && events?.length === 0 ? (
        <Typography variant="h4" sx={{ textAlign: "center", mt: 10 }}>
          No hay elemetos que mostrar
        </Typography>
      ) : (
        <Box sx={{ my: 5 }}>
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              <Divider textAlign="left">Eventos</Divider>
            </Typography>
            <EventList events={events} role={role} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              <Divider textAlign="left">Noticias</Divider>
            </Typography>
            <NewsList news={news} role={role} />
          </Box>
        </Box>
      )}
    </>
  );
};

export default HomeScreen;
