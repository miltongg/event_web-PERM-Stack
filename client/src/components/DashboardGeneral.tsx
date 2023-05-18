import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { useEffect, useState } from "react";

import { dashboardTableHeadStyle } from "../helpers/customStyles";
import { webApi } from "../helpers/animeApi";
import Loading from "./Loading";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";

interface ITableHead {
  id: string;
  label: string;
  style: any;
}

const tableHead: ITableHead[] = [
  { id: "element", label: "Elemento", style: dashboardTableHeadStyle },
  { id: "count", label: "Total", style: dashboardTableHeadStyle },
];

const DashboardGeneral = () => {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const users = await webApi.get("/users", {
          headers: { token, limit: 9999999 },
        });

        const events = await webApi.get("/event", {
          headers: { token, limit: 9999999 },
        });

        const news = await webApi.get("/news", {
          headers: { token, limit: 9999999 },
        });

        setUsers(users.data);
        setEvents(events.data.eventsList);
        setNews(news.data.newsList);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(getError(error));
      }
    };

    getData();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <TableContainer component={Paper}>
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
          {
            <TableRow>
              <TableCell sx={{ textAlign: "center" }}>Usuarios</TableCell>
              <TableCell sx={{ textAlign: "center" }}>{users.length}</TableCell>
            </TableRow>
          }
          {
            <TableRow>
              <TableCell sx={{ textAlign: "center" }}>Eventos</TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                {events.length}
              </TableCell>
            </TableRow>
          }
          {
            <TableRow>
              <TableCell sx={{ textAlign: "center" }}>Noticias</TableCell>
              <TableCell sx={{ textAlign: "center" }}>{news.length}</TableCell>
            </TableRow>
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DashboardGeneral;
