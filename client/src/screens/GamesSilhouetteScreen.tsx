import React, { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { webApi } from "../helpers/animeApi";
import moment from "moment/moment";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";
import {
  Backdrop,
  Box,
  Button,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import Loading from "../components/Loading";
import GameList from "../components/GameList";

interface Props {
  role: string;
}

const GamesSilhouetteScreen = ({ role }: Props) => {
  const { search } = useLocation();
  let query = new URLSearchParams(search);
  const pageNumber = Number(query.get("page")) || 1;

  const [page, setPage] = useState<number>(pageNumber);
  const [games, setGames] = useState([]);
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
      const getGames = async () => {
        setLoading(true);
        let { data } = await webApi(`/game?page=${page}`, {
          headers: { limit, offset },
        });

        const { gamesList, count } = data;

        for (let element of gamesList) {
          element.date = moment(element.date).format("DD/MM/YYYY");
        }

        setGames(gamesList);
        setCount(parseInt(String(count / 2)));
        setLoading(false);

        document.documentElement.scrollTo({
          top: 0,
          left: 0,
          // behavior: "instant", // Optional if you want to skip the scrolling animation
        });
      };

      getGames();
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
            onClick={() => navigate("/game/add")}
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
      {!loading && games?.length === 0 ? (
        <Typography variant="h4" sx={{ textAlign: "center", mt: 10 }}>
          No hay elemetos que mostrar
        </Typography>
      ) : (
        <Box sx={{ mt: 5 }}>
          <GameList games={games} role={role} />
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

export default GamesSilhouetteScreen;
