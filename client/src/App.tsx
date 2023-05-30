import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import {
  Container,
  Box,
  CssBaseline,
  Grid,
  LinearProgress,
} from "@mui/material";
import Header from "./components/Header";
import { Footer } from "./components/Footer";
import { SideBar } from "./components/SideBar";
import HomeScreen from "./screens/HomeScreen";
import SignupScreen from "./screens/SignupScreen";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileScreen from "./screens/ProfileScreen";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import decodeToken from "./libs/decodeToken";
import { setUser } from "./store/slices/user/userSlice";
import { IRootState } from "./interfaces/interfaces";
import SigninScreen from "./screens/SigninScreen";
import RecoverPasswordScreen from "./screens/RecoverPasswordScreen";
import AddEventScreen from "./screens/AddEventScreen";
import EventScreen from "./screens/EventScreen";
import EventListScreen from "./screens/EventListScreen";
import ScrollToTop from "./components/ScrollToTop";
import AddNewsScreen from "./screens/AddNewsScreen";
import NewsScreen from "./screens/NewsScreen";
import NewsListScreen from "./screens/NewsListScreen";
import DashboardScreen from "./screens/DashboardScreen";
import GamesListScreen from "./screens/GamesListScreen";
import DashboardUser from "./components/DashboardUser";
import DashboardEvent from "./components/DashboardEvent";
import DashboardNews from "./components/DashboardNews";
import AddGameScreen from "./screens/AddGameScreen";
import GamesSilhouetteScreen from "./screens/GamesSilhouetteScreen";
import GameScreen from "./screens/GameScreen";

function App() {
  const token = localStorage.getItem("token");

  const dispatch = useDispatch();

  const { id, username, userImg, role } = useSelector(
    (state: IRootState) => state.user.user
  );

  useEffect(() => {
    async function call() {
      if (token) {
        dispatch(setUser({ user: await decodeToken(token) }));
      }
    }

    call();
  }, [token, dispatch]);

  let mainColumSize = 8;
  let hideSidebar = false;

  const hideSidebarRoutesWords = [
    "signup",
    "signin",
    "profile",
    "recover",
    "events",
    "dashboard",
    "add",
  ];

  const { pathname } = useLocation();

  const pathwords = pathname
    .split("/")
    .filter((word) => hideSidebarRoutesWords.includes(word));

  if (pathwords.length) {
    mainColumSize = 12;
    hideSidebar = true;
  }

  if (token && !id) return <LinearProgress />;

  return (
    <>
      <ToastContainer />
      <Header id={id} userImg={userImg} />
      <Box component="main" sx={{ minHeight: "100vh" }}>
        <CssBaseline />
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={mainColumSize}>
              <ScrollToTop />
              <Routes>
                {/* AUTH */}
                <Route path="/" element={<HomeScreen role={role} />} />
                <Route
                  path="/signup"
                  element={id ? <Navigate to={"/"} /> : <SignupScreen />}
                />
                <Route
                  path="/signin"
                  element={id ? <Navigate to={"/"} /> : <SigninScreen />}
                />
                <Route
                  path="/recover"
                  element={
                    id ? <Navigate to={"/"} /> : <RecoverPasswordScreen />
                  }
                />

                {/* EVENT */}
                <Route
                  path="/event"
                  element={<EventListScreen role={role} />}
                />
                <Route
                  path="/event/:slug"
                  element={
                    <EventScreen userId={id} role={role} userImg={userImg} />
                  }
                />
                <Route
                  path="/event/add"
                  element={
                    role === "admin" ? (
                      <AddEventScreen id={id!} />
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />

                {/* NEWS */}
                <Route path="/news" element={<NewsListScreen role={role} />} />
                <Route
                  path="/news/:slug"
                  element={
                    <NewsScreen userId={id} role={role} userImg={userImg} />
                  }
                />
                <Route
                  path="/news/add"
                  element={
                    role === "admin" ? (
                      <AddNewsScreen id={id!} />
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />

                {/* PROFILE */}
                <Route
                  path={"/profile/:id"}
                  element={
                    id ? <ProfileScreen userId={id} /> : <SigninScreen />
                  }
                />

                {/* DASHBOARD */}
                <Route
                  path="/dashboard"
                  element={
                    role === "admin" ? <DashboardScreen /> : <Navigate to="/" />
                  }
                >
                  <Route path="users" element={<DashboardUser />} />
                  <Route path="events" element={<DashboardEvent />} />
                  <Route path="news" element={<DashboardNews />} />
                </Route>

                {/* GAMES */}
                <Route path="/game" element={<GamesListScreen />} />
                <Route path="/game/add" element={<AddGameScreen />} />
                <Route
                  path="/game/silhouette"
                  element={<GamesSilhouetteScreen role={role} />}
                />
                <Route
                  path="/game/silhouette/:id"
                  element={
                    <GameScreen userId={id} role={role} userImg={userImg} />
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Grid>
            {!hideSidebar ? (
              <Grid item xs={12} md={4}>
                <SideBar />
              </Grid>
            ) : (
              ""
            )}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

export default App;
