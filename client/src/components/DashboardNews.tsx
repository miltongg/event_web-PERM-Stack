import React, { useEffect, useState } from "react";
import {
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
  dashboardTableBodyStyle,
  dashboardTableHeadStyle,
} from "../helpers/customStyles";
import dateFormat from "../helpers/dateFormat";
import definedConst from "../helpers/definedConst";

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

const tableHead: ITableHead[] = [
  {
    id: "eventImg",
    label: "Foto",
    style: dashboardTableHeadStyle,
  },
  // {
  //   id: "id",
  //   label: "ID",
  //   style: dashboardTableHeadStyle,
  // },
  {
    id: "name",
    label: "Nombre",
    style: dashboardTableHeadStyle,
  },
  // {
  //   id: "comments",
  //   label: "No. Coment",
  //   style: dashboardTableHeadStyle,
  // },
  // {
  //   id: "rating",
  //   label: "Valoración",
  //   style: dashboardTableHeadStyle,
  // },
  // {
  //   id: "views",
  //   label: "Vistas",
  //   style: dashboardTableHeadStyle,
  // },
  {
    id: "createdAt",
    label: "Creado",
    style: dashboardTableHeadStyle,
  },
  {
    id: "status",
    label: "Estado",
    style: dashboardTableHeadStyle,
  },
  {
    id: "actions",
    label: "Acciones",
    style: dashboardTableHeadStyle,
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
          {news.map((n, index: number) => (
            <TableRow
              key={n.id}
              // onClick={() => handleUserClick(user)}
            >
              <TableCell sx={dashboardTableBodyStyle}>
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
              {/*<TableCell sx={dashboardTableBodyStyle}>{n.id}</TableCell>*/}
              <TableCell sx={dashboardTableBodyStyle}>{n.name}</TableCell>
              {/*<TableCell sx={dashboardTableBodyStyle}>*/}
              {/*  {n.commentsCount}*/}
              {/*</TableCell>*/}
              {/*<TableCell sx={dashboardTableBodyStyle}>*/}
              {/*  {!n.rating ? 0 : n.rating}*/}
              {/*</TableCell>*/}
              {/*<TableCell sx={dashboardTableBodyStyle}>{n.views}</TableCell>*/}

              <TableCell sx={dashboardTableBodyStyle}>
                {dateFormat(n.createdAt)}
              </TableCell>
              <TableCell sx={dashboardTableBodyStyle}>
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
                  <Chip
                    color={
                      n.status === definedConst.STATUS_ACTIVE
                        ? "success"
                        : n.status === definedConst.STATUS_PENDING
                        ? "warning"
                        : "default"
                    }
                    size="small"
                    label={n.status}
                  />
                )}
              </TableCell>
              <TableCell sx={dashboardTableBodyStyle}>
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
    </TableContainer>
  );
};

export default DashboardNews;
