import { useEffect, useState } from "react";
import { webApi } from "../helpers/animeApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";
import moment from "moment";
import { AddCircle } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import NewsList from "../components/NewsList";
import Loading from "../components/Loading";

interface INews {
  id: string;
  name: string;
  subtitle: string;
  slug: string;
  description: string;
  tag: string;
  userId: string;
  mainImage: string;
  date: string | {};
  views: number;
  commentsCount: number;
}

interface Props {
  role: string;
}

const NewsListScreen = ({ role }: Props) => {
  const [news, setNews] = useState([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getNews = async () => {
      try {
        const { data } = await webApi.get(`/news`, {
          headers: { limit, offset },
        });

        for (let element of data) {
          element.date = moment(element.date).format("DD/MM/YYYY");
        }

        setNews(data);
        setLoading(false);
      } catch (error: any) {
        toast.error(getError(error));
      }
    };

    getNews();
  }, []);

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
        <Loading />
      ) : news?.length !== 0 ? (
        <NewsList news={news} role={role} />
      ) : (
        <Typography variant="h4" sx={{ textAlign: "center", mt: 10 }}>
          No hay elemetos que mostrar
        </Typography>
      )}
    </>
  );
};

export default NewsListScreen;
