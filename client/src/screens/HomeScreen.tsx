import {
 CircularProgress,
} from "@mui/material";
import moment from "moment";
import { webApi } from "../helpers/animeApi";
import {useState, useEffect, lazy} from "react";
import { getError } from "../helpers/handleErrors";
import { toast } from "react-toastify";
import EventList from "../components/EventList";

const HomeScreen = () => {
  const [events, setEvents] = useState([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    try {
      const getEvents = async () => {
        let { data } = await webApi("/event", {
          headers: { limit, offset },
        });
        
        for (let element of data) {
          element.date = moment(element.date).format('DD/MM/YYYY')
        }

        setEvents(data);
      };

      getEvents();
    } catch (error) {
      toast.error(getError(error));
    }
  }, []);

  return (
    events?.length !== 0 ? <EventList events={events} /> : <CircularProgress/>
  );
};

export default HomeScreen;
