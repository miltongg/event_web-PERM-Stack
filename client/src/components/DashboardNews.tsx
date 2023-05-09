import { useEffect, useState } from "react";
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
import { NEWS_IMG_URL } from "../helpers/url";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import { webApi } from "../helpers/animeApi";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";
import { statusList } from "../helpers/tasgList";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import Loading from "./Loading";
import {
  dashboardImgGrow,
  dashboardImgStandard,
} from "../helpers/customStyles";
import dateFormat from "../helpers/dateFormat";

interface INews {
  id: string;
  name: string;
  subtitle: string;
  slug: string;
  description: string;
  tag: string;
  userId: string;
  rating: number;
  status: string;
  mainImage: string;
  createdAt: string;
  views: number;
  commentsCount: number;
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

const DashboardNews = () => {
  const token = localStorage.getItem("token");
  const [news, setNews] = useState<INews[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [imgGrow, setImgGrow] = useState<number | null>(null);
  const [edit, setEdit] = useState<{ edit: boolean; index: number | null }>({
    edit: false,
    index: null,
  });
  const [editNews, setEditNews] = useState<{ status: string }>({
    status: "",
  });

  // GET EVENT //
  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      try {
        const { data } = await webApi.get("/news", {
          headers: {
            limit: 10,
            offset: 0,
          },
        });

        const { newsList, count } = data;


        setNews(newsList);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(getError(error));
      }
    };

    getEvents();
  }, []);

  // CHANGE EVENT VALUES //
  const handleEditNews = (id: string, index: number) => {
    setEditNews({
      ...editNews,
      status: news.find((n) => n.id === id)?.status!,
    });

    if (edit.index === index) {
      setEdit({ ...edit, edit: false, index: null });
    } else {
      setEdit({ ...edit, edit: true, index });
    }
  };

  // UPDATE EVENTS //
  const handleUpdateNews = async (slug: string) => {
    try {
      setLoading(true);

      await webApi.put(
        `/event/${slug}`,
        {
          status: editNews.status,
        },
        {
          headers: { token },
        }
      );

      news.map((n) => {
        if (n.slug === slug) {
          n.status = editNews.status;
        }
      });
      setEdit({ ...edit, edit: false, index: null });
      toast.success("Se ha actualizado la noticia");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  };

  // DELETE EVENT //
  const handleDeleteNews = async (id: string, name: string) => {
    try {
      Confirm.show(
        `¿Deseas borrar la noticia?`,
        `${name}`,
        "Si",
        "No",
        async () => {
          await webApi.delete(`/news/${id}`, {
            headers: { token },
          });
          setNews(news.filter((n) => n.id !== id));
          toast.success(`Has borrado la noticia ${name}`);
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
        {news.map((n, index: number) => (
          <TableRow
            key={n.id}
            // onClick={() => handleUserClick(user)}
          >
            <TableCell>
              <img
                style={
                  imgGrow === index ? dashboardImgGrow : dashboardImgStandard
                }
                src={`${NEWS_IMG_URL}${n.id}/${n.mainImage}`}
                alt="foto"
                onClick={
                  imgGrow === index
                    ? () => setImgGrow(null)
                    : () => setImgGrow(index)
                }
              />
            </TableCell>
            <TableCell>{n.id}</TableCell>
            <TableCell>{n.name}</TableCell>
            <TableCell>{n.commentsCount}</TableCell>
            <TableCell>{n.rating}</TableCell>
            <TableCell>{n.views}</TableCell>

            <TableCell>{dateFormat(n.createdAt)}</TableCell>
            <TableCell>
              {edit.edit && index === edit.index ? (
                <TextField
                  required
                  name="status"
                  label="estado"
                  variant="standard"
                  select
                  value={editNews.status}
                  sx={{ mt: -2 }}
                  onChange={(e) =>
                    setEditNews({ ...editNews, status: e.target.value })
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
                n.status
              )}
            </TableCell>
            <TableCell>
              <IconButton
                color="warning"
                disabled={loading}
                onClick={() => handleEditNews(n.id, index)}
              >
                <EditIcon />
              </IconButton>
              {edit.edit && edit.index === index ? (
                <IconButton
                  color="error"
                  disabled={loading}
                  onClick={() => handleUpdateNews(n.slug)}
                >
                  <DoneIcon />
                </IconButton>
              ) : (
                <IconButton
                  color="error"
                  disabled={loading}
                  onClick={() => handleDeleteNews(n.id, n.name)}
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

export default DashboardNews;
