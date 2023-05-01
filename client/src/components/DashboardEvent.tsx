import React, { useEffect, useState } from "react";
import {
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { EVENT_IMG_URL, USER_IMG_URL } from "../helpers/url";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import { webApi } from "../helpers/animeApi";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";
import { statusList, roleList, newsTagList } from "../helpers/tasgList";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import Loading from "./Loading";
import {
  dashboardImgGrow,
  dashboardImgStandard,
} from "../helpers/customStyles";

interface IEvent {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  description: string;
  commentsCount: number;
  rating: number;
  status: string;
  views: number;
  mainImage: string;
  eventImages: string[];
}

interface ITableHead {
  id: string;
  label: string;
  style: any;
}

const cellStyle = {
  textAlign: "center",
  fontWeight: "bold",
};

const tableHead: ITableHead[] = [
  {
    id: "eventImg",
    label: "Foto",
    style: cellStyle,
  },
  {
    id: "id",
    label: "ID",
    style: cellStyle,
  },
  {
    id: "name",
    label: "Nombre",
    style: cellStyle,
  },
  {
    id: "comments",
    label: "No. Coment",
    style: cellStyle,
  },
  {
    id: "rating",
    label: "Valoración",
    style: cellStyle,
  },
  {
    id: "views",
    label: "Vistas",
    style: cellStyle,
  },
  {
    id: "createdAt",
    label: "Creado",
    style: cellStyle,
  },
  {
    id: "status",
    label: "Estado",
    style: cellStyle,
  },
  {
    id: "actions",
    label: "Acciones",
    style: cellStyle,
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}/${year}`;
};

const DashboardEvent = () => {
  const token = localStorage.getItem("token");
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [imgGrow, setimgGrow] = useState<number | null>(null);
  const [edit, setEdit] = useState<{ edit: boolean; index: number | null }>({
    edit: false,
    index: null,
  });
  const [editEvent, setEditEvent] = useState<{ status: string }>({
    status: "",
  });

  // GET EVENT //
  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      try {
        const { data } = await webApi.get("/event", {
          headers: {
            limit: 10,
            offset: 0,
          },
        });

        setEvents(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(getError(error));
      }
    };

    getEvents();
  }, []);

  // CHANGE USER VALUES //
  // const handleEditUser = (id: string, index: number) => {
  //   setEditUser({
  //     ...editUser,
  //     role: users.find((user) => user.id === id)?.role!,
  //     status: users.find((user) => user.id === id)?.status!,
  //   });
  //
  //   if (edit.index === index) {
  //     setEdit({ ...edit, edit: false, index: null });
  //   } else {
  //     setEdit({ ...edit, edit: true, index });
  //   }
  // };

  // UPDATE USERS //
  // const handleUpdateUser = async (id: string) => {
  //   try {
  //     setLoading(true);
  //
  //     await webApi.put(
  //       `/user/${id}`,
  //       {
  //         role: editUser.role,
  //         status: editUser.status,
  //       },
  //       {
  //         headers: { token },
  //       }
  //     );
  //
  //     users.map((user) => {
  //       if (user.id === id) {
  //         user.role = editUser.role;
  //         user.status = editUser.status;
  //       }
  //     });
  //     setEdit({ ...edit, edit: false, index: null });
  //     toast.success("Se ha actualizado el usuario");
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     toast.error(getError(error));
  //   }
  // };

  // DELETE EVENT //
  const handleDeleteEvent = async (id: string, name: string) => {
    try {
      Confirm.show(
        `¿Deseas borrar el evento?`,
        `${name}`,
        "Si",
        "No",
        async () => {
          await webApi.delete(`/event/${id}`, {
            headers: { token },
          });
          setEvents(events.filter((event) => event.id !== id));
          toast.success(`Has borrado el evento ${name}`);
        },
        () => {},
        {
          titleColor: "black",
          okButtonBackground: "orange",
          titleFontSize: "20px",
          messageFontSize: "16px",
        }
      );
    } catch (error: any) {
      toast.error(getError(error));
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <Table>
      <TableHead>
        <TableRow>
          {tableHead.map((head) => (
            <TableCell key={head.id} style={head.style}>
              {head.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {events.map((event, index: number) => (
          <TableRow
            key={event.id}
            // onClick={() => handleUserClick(user)}
          >
            <TableCell>
              <img
                style={
                  imgGrow === index ? dashboardImgGrow : dashboardImgStandard
                }
                src={`${EVENT_IMG_URL}${event.id}/${event.mainImage}`}
                alt="foto"
                onClick={
                  imgGrow === index
                    ? () => setimgGrow(null)
                    : () => setimgGrow(index)
                }
              />
            </TableCell>
            <TableCell>{event.id}</TableCell>
            <TableCell>{event.name}</TableCell>
            <TableCell>{event.commentsCount}</TableCell>
            <TableCell>{event.rating}</TableCell>
            <TableCell>{event.views}</TableCell>

            <TableCell>{formatDate(event.createdAt)}</TableCell>
            <TableCell>
              {edit.edit && index === edit.index ? (
                <TextField
                  required
                  name="status"
                  label="estado"
                  variant="standard"
                  select
                  value={editEvent.status}
                  sx={{ mt: -2 }}
                  onChange={(e) =>
                    setEditEvent({ ...editEvent, status: e.target.value })
                  }
                  fullWidth
                >
                  {statusList.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                event.status
              )}
            </TableCell>
            <TableCell>
              <IconButton
                color="warning"
                disabled={loading}
                // onClick={() => handleEditUser(user.id, index)}
              >
                <EditIcon />
              </IconButton>
              {edit.edit && edit.index === index ? (
                <IconButton
                  color="error"
                  disabled={loading}
                  // onClick={() => handleUpdateUser(user.id)}
                >
                  <DoneIcon />
                </IconButton>
              ) : (
                <IconButton
                  color="error"
                  disabled={loading}
                  onClick={() => handleDeleteEvent(event.id, event.name)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DashboardEvent;
