import {Box, Button, CircularProgress, Typography} from '@mui/material';
import moment from 'moment';
import {useEffect, useState} from 'react'
import {toast} from 'react-toastify';
import EventList from '../components/EventList';
import {webApi} from '../helpers/animeApi';
import {getError} from '../helpers/handleErrors';
import {AddCircle} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

interface Props {
  role: string
}

const EventListScreen = ({role}: Props) => {
  const [events, setEvents] = useState([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate();
  
  useEffect(() => {
    try {
      const getEvents = async () => {
        let {data} = await webApi("/event", {
          headers: {limit, offset},
        });
        
        for (let element of data) {
          element.date = moment(element.date).format('DD/MM/YYYY')
        }
        
        setEvents(data);
        setLoading(false)
      };
      
      getEvents();
    } catch (error) {
      setLoading(false)
      toast.error(getError(error));
    }
  }, []);
  
  return (
    <>
      {
        role === 'admin'
          ? <Box sx={{mt: 5, mb: -1, textAlign: 'right'}}>
            <Button
              startIcon={<AddCircle/>}
              onClick={() => navigate('/event/add')}
            >
              Añadir evento
            </Button>
          </Box>
          : ''
      }
      {loading
        ? <CircularProgress/>
        : events?.length !== 0
          ? <EventList events={events} role={role}/>
          : <Typography variant="h4" sx={{textAlign: 'center', mt: 10}}>No hay elemetos que mostrar</Typography>
      }
    </>
  );
}

export default EventListScreen;