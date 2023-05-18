import React, { useEffect, useState } from "react";
import {
  Avatar,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
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
import { userStatusList, roleList } from "../helpers/tasgList";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import Loading from "./Loading";
import {
  dashboardImgGrow,
  dashboardImgStandard,
  dashboardTableBodyStyle,
  dashboardTableHeadStyle,
} from "../helpers/customStyles";
import dateFormat from "../helpers/dateFormat";
import definedConst from "../helpers/definedConst";

interface IUsers {
  id: string;
  name: string;
  username: string;
  email: string;
  status: string;
  role: string;
  userImg: string;
  createdAt: string;
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
    id: "userImg",
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
    id: "username",
    label: "Apodo",
    style: cellStyle,
  },
  {
    id: "email",
    label: "Correo",
    style: cellStyle,
  },
  {
    id: "role",
    label: "Rol",
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

const DashboardUser = () => {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState<IUsers[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [imgGrow, setImgGrow] = useState<number | null>(null);
  const [edit, setEdit] = useState<{ edit: boolean; index: number | null }>({
    edit: false,
    index: null,
  });
  const [editUser, setEditUser] = useState<{ status: string; role: string }>({
    status: "",
    role: "",
  });

  // GET USERS //
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const { data } = await webApi.get("/users", {
          headers: {
            limit: 10,
            offset: 0,
          },
        });

        setUsers(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(getError(error));
      }
    };

    getUsers();
  }, []);

  // CHANGE USER VALUES //
  const handleEditUser = (id: string, index: number) => {
    setEditUser({
      ...editUser,
      role: users.find((user) => user.id === id)?.role!,
      status: users.find((user) => user.id === id)?.status!,
    });

    if (edit.index === index) {
      setEdit({ ...edit, edit: false, index: null });
    } else {
      setEdit({ ...edit, edit: true, index });
    }
  };

  // UPDATE USERS //
  const handleUpdateUser = async (id: string) => {
    try {
      setLoading(true);

      await webApi.put(
        `/user/${id}`,
        {
          role: editUser.role,
          status: editUser.status,
        },
        {
          headers: { token },
        }
      );

      users.map((user) => {
        if (user.id === id) {
          user.role = editUser.role;
          user.status = editUser.status;
        }
      });
      setEdit({ ...edit, edit: false, index: null });
      toast.success("Se ha actualizado el usuario");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  };

  // DELETE USER //
  const handleDeleteUser = async (id: string, username: string) => {
    try {
      Confirm.show(
        `¿Deseas borrar el usuario?`,
        `${username}`,
        "Si",
        "No",
        async () => {
          await webApi.delete(`/user/${id}`, {
            headers: { token },
          });

          setUsers(users.filter((user) => user.id !== id));

          toast.success(`Has borrado el usuario ${username}`);
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
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {tableHead.map((head) => (
              <TableCell
                sx={dashboardTableHeadStyle}
                key={head.id}
                style={head.style}
              >
                {head.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index: number) => (
            <TableRow
              key={user.id}
              // onClick={() => handleUserClick(user)}
            >
              <TableCell sx={dashboardTableBodyStyle}>
                {user?.userImg ? (
                  <Avatar src={`${USER_IMG_URL}${user.id}/${user.userImg}`} />
                ) : (
                  <Avatar />
                )}
              </TableCell>
              <TableCell sx={dashboardTableBodyStyle}>{user.id}</TableCell>
              <TableCell sx={dashboardTableBodyStyle}>{user.name}</TableCell>
              <TableCell sx={dashboardTableBodyStyle}>
                {user.username}
              </TableCell>
              <TableCell sx={dashboardTableBodyStyle}>{user.email}</TableCell>
              <TableCell sx={dashboardTableBodyStyle}>
                {edit.edit && index === edit.index ? (
                  <TextField
                    required
                    name="rol"
                    label="rol"
                    variant="standard"
                    select
                    value={editUser.role}
                    sx={{ mt: -2 }}
                    onChange={(e) =>
                      setEditUser({ ...editUser, role: e.target.value })
                    }
                    fullWidth
                  >
                    {roleList.map(({ value, label }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  user.role
                )}
              </TableCell>
              <TableCell sx={dashboardTableBodyStyle}>
                {dateFormat(user.createdAt)}
              </TableCell>
              <TableCell sx={dashboardTableBodyStyle}>
                {edit.edit && index === edit.index ? (
                  <TextField
                    required
                    name="status"
                    label="estado"
                    variant="standard"
                    select
                    value={editUser.status}
                    sx={{ mt: -2 }}
                    onChange={(e) =>
                      setEditUser({ ...editUser, status: e.target.value })
                    }
                    fullWidth
                  >
                    {userStatusList.map(({ value, label }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <Chip
                    color={
                      user.status === definedConst.STATUS_ACTIVE
                        ? "success"
                        : user.status === definedConst.STATUS_BANNED
                        ? "error"
                        : user.status === definedConst.STATUS_PENDING
                        ? "warning"
                        : "default"
                    }
                    size="small"
                    label={user.status}
                  />
                )}
              </TableCell>
              <TableCell sx={dashboardTableBodyStyle}>
                <IconButton
                  color="warning"
                  disabled={loading}
                  onClick={() => handleEditUser(user.id, index)}
                >
                  <EditIcon />
                </IconButton>
                {edit.edit && edit.index === index ? (
                  <IconButton
                    color="error"
                    disabled={loading}
                    onClick={() => handleUpdateUser(user.id)}
                  >
                    <DoneIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    color="error"
                    disabled={loading}
                    onClick={() => handleDeleteUser(user.id, user.username)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DashboardUser;
