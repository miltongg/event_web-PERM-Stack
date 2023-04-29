import { CircularProgress, Typography } from "@mui/material";
import moment from "moment";
import { webApi } from "../helpers/animeApi";
import { useState, useEffect } from "react";
import { getError } from "../helpers/handleErrors";
import { toast } from "react-toastify";
import EventList from "../components/EventList";

interface Props {
  role: string | null;
}

const HomeScreen = ({ role }: Props) => {
  const [events, setEvents] = useState([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const getEvents = async () => {
        let { data } = await webApi("/event", {
          headers: { limit, offset },
        });

        for (let element of data) {
          element.date = moment(element.date).format("DD/MM/YYYY");
        }

        setEvents(data);
        setLoading(false);
      };

      getEvents();
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  }, []);

  return loading ? (
    <CircularProgress />
  ) : events?.length !== 0 ? (
    <EventList events={events} role={role} />
  ) : (
    <Typography variant="h4" sx={{ textAlign: "center", mt: 10 }}>
      No hay elemetos que mostrar
    </Typography>
  );
};

export default HomeScreen;
