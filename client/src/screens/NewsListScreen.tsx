import { ChangeEvent, useEffect, useState } from "react";
import { webApi } from "../helpers/animeApi";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";
import moment from "moment";
import { AddCircle } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import NewsList from "../components/NewsList";
import Loading from "../components/Loading";

// interface INews {
//   id: string;
//   name: string;
//   subtitle: string;
//   slug: string;
//   description: string;
//   tag: string;
//   userId: string;
//   mainImage: string;
//   date: string | {};
//   views: number;
//   commentsCount: number;
// }

interface Props {
  role: string;
}

const NewsListScreen = ({ role }: Props) => {
  const { search } = useLocation();
  let query = new URLSearchParams(search);
  const pageNumber = Number(query.get("page")) || 1;

  const [news, setNews] = useState([]);
  const [page, setPage] = useState<number>(pageNumber);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(limit * (page - 1));
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const getNews = async () => {
      try {
        const { data } = await webApi.get(`/news?page=${page}`, {
          headers: { limit, offset },
        });

        const { newsList, count } = data;

        for (let element of newsList) {
          element.date = moment(element.date).format("DD/MM/YYYY");
        }

        setNews(newsList);
        setCount(parseInt(String(count / 2)));
        setLoading(false);
      } catch (error: any) {
        toast.error(getError(error));
      }
    };

    getNews();
  }, [reload]);

  // RENDER //
  return (
    <>
      {role === "admin" ? (
        <Box sx={{ mt: 5, mb: -1, textAlign: "right" }}>
          <Button
            startIcon={<AddCircle />}
            onClick={() => navigate("/news/add")}
          >
            Añadir Noticia
          </Button>
        </Box>
      ) : (
        ""
      )}
      {loading ? (
        <Backdrop open={loading} sx={{ zIndex: 1 }}>
          <Loading />
        </Backdrop>
      ) : news?.length !== 0 ? (
        <>
          <NewsList news={news} role={role} />
          {!loading && count >= 10 ? (
            <Stack spacing={2} sx={{ mb: 5 }}>
              <Pagination
                onChange={handlePageChange}
                count={count}
                page={page}
                shape="rounded"
              />
            </Stack>
          ) : (
            ""
          )}
        </>
      ) : (
        <Typography variant="h4" sx={{ textAlign: "center", mt: 10 }}>
          No hay elemetos que mostrar
        </Typography>
      )}
    </>
  );
};

export default NewsListScreen;
