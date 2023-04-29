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
import { useEffect, useState } from "react";
import decodeToken from "./libs/decodeToken";
import { setUser } from "./store/slices/user/userSlice";
import { IRootState } from "./interfaces/interfaces";
import SigninScreen from "./screens/SigninScreen";
import RecoverPasswordScreen from "./screens/RecoverPasswordScreen";
import AddEventScreen from "./screens/AddEventScreen";
import EventScreen from "./screens/EventScreen";
import { webApi } from "./helpers/animeApi";
import EventListScreen from "./screens/EventListScreen";
import ScrollToTop from "./components/ScrollToTop";
import AddNewsScreen from "./screens/AddNewsScreen";
import NewsScreen from "./screens/NewsScreen";
import NewsListScreen from "./screens/NewsListScreen";
import DashboardScreen from "./screens/DashboardScreen";

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

  const removeSidebarRoutes = [
    "signup",
    "signin",
    "profile",
    "recover",
    "events",
    "dashboard",
  ];

  let { pathname } = useLocation();
  pathname = pathname.split("/")[1];

  if (removeSidebarRoutes.includes(pathname)) {
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={mainColumSize}>
              <ScrollToTop />
              <Routes>
                {/* AUTH */}
                <Route path="/" element={<HomeScreen role={role} />} />
                <Route path="/signup" element={<SignupScreen />} />
                <Route path="/signin" element={<SigninScreen />} />
                <Route path="/recover" element={<RecoverPasswordScreen />} />

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
                <Route path="/event/add" element={<AddEventScreen id={id} />} />

                {/* NEWS */}
                <Route path="/news" element={<NewsListScreen role={role} />} />
                <Route
                  path="/news/:slug"
                  element={
                    <NewsScreen userId={id} role={role} userImg={userImg} />
                  }
                />
                <Route path="/news/add" element={<AddNewsScreen id={id} />} />

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
                    role === "admin" ? (
                      <DashboardScreen />
                    ) : (
                      <Navigate to={"/"} />
                    )
                  }
                />
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
