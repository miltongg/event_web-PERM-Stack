import {
  Backdrop,
  Box,
  Button,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState, ChangeEvent } from "react";
import { toast } from "react-toastify";
import EventList from "../components/EventList";
import { webApi } from "../helpers/animeApi";
import { getError } from "../helpers/handleErrors";
import { AddCircle } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

interface Props {
  role: string;
}

const EventListScreen = ({ role }: Props) => {
  const { search } = useLocation();
  let query = new URLSearchParams(search);
  const pageNumber = Number(query.get("page")) || 1;

  const token = localStorage.getItem("token");

  const [page, setPage] = useState<number>(pageNumber);
  const [events, setEvents] = useState([]);
  const [limit, setLimit] = useState(3);
  const [offset, setOffset] = useState(limit * (page - 1));
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [reload, setReload] = useState<boolean>(false);

  // CHANGE PAGE //
  const handlePageChange = (e: ChangeEvent<unknown>, page: number) => {
    setPage(page);
    setOffset(limit * (page - 1));
    navigate(`?page=${page}`);
    setReload(!reload);
  };

  // SET ALL TO STARTS VALUE IF EVENT LINK IS PRESSED //
  useEffect(() => {
    if (pageNumber === 1) {
      setPage(1);
      setOffset(0);
      setReload(!reload);
    }
  }, [search]);

  // GET EVENTS //
  useEffect(() => {
    try {
      const getEvents = async () => {
        setLoading(true);
        let { data } = await webApi(`/event?page=${page}`, {
          headers: { limit, offset, token },
        });

        const { eventsList, count } = data;

        // for (let element of eventsList) {
        //   element.date = moment(element.date).format("DD/MM/YYYY");
        // }

        setEvents(eventsList);
        setCount(parseInt(String(count / 2)));
        setLoading(false);

        document.documentElement.scrollTo({
          top: 0,
          left: 0,
          // behavior: "instant", // Optional if you want to skip the scrolling animation
        });
      };

      getEvents();
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  }, [reload]);

  // RENDER //
  return (
    <>
      {role === "admin" ? (
        <Box sx={{ mt: 5, mb: -1, textAlign: "right" }}>
          <Button
            startIcon={<AddCircle />}
            onClick={() => navigate("/event/add")}
          >
            Añadir evento
          </Button>
        </Box>
      ) : (
        ""
      )}
      {loading ? (
        <Backdrop open={loading} sx={{ zIndex: 1 }}>
          <Loading />
        </Backdrop>
      ) : (
        ""
      )}
      {!loading && events?.length === 0 ? (
        <Typography variant="h4" sx={{ textAlign: "center", mt: 10 }}>
          No hay eventos que mostrar
        </Typography>
      ) : (
        <Box sx={{ mt: 5 }}>
          <EventList events={events} role={role} />
          {!loading && count >= 2 ? (
            <Stack spacing={2} sx={{ mb: 5 }}>
              <Pagination
                onChange={handlePageChange}
                count={count}
                page={page}
                shape="rounded"
              />
            </Stack>
          ) : null}
        </Box>
      )}
    </>
  );
};

export default EventListScreen;
