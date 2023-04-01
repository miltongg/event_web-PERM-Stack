import {Routes, Route, useLocation, useNavigate} from "react-router-dom";
import {Container, Box, CssBaseline, Grid, LinearProgress} from "@mui/material";
import Header from "./components/Header";
import { Footer } from "./components/Footer";
import { SideBar } from "./components/SideBar";
import HomeScreen from "./screens/HomeScreen";
import SignupScreen from "./screens/SignupScreen";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import ProfileScreen from "./screens/ProfileScreen";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import decodeToken from "./libs/decodeToken";
import {setUser} from "./store/slices/user/userSlice";
import {IRootState} from "./interfaces/interfaces";
import SigninScreen from "./screens/SigninScreen";
import RecoverPasswordScreen from "./screens/RecoverPasswordScreen";
import AddEventScreen from "./screens/AddEventScreen";
import EventScreen from "./screens/EventScreen";

function App() {
  
  const token = localStorage.getItem("token");
  
  const dispatch = useDispatch();
  
  const {id, userImg} = useSelector((state: IRootState) => state.user.user)
  
  // if (!id) {
  //   localStorage.removeItem('token');
  // }
  
  useEffect(() => {
    async function call() {
      if (token)
        dispatch(setUser({user: await decodeToken(token)}))
    }
    call();
    
  }, [token, dispatch])
  
  let mainColumSize = 8;
  let hideSidebar = false;

  const removeSidebarRoutes = ['signup', 'signin', 'profile', 'recover', 'events'];
  
  let {pathname} = useLocation();
  pathname = pathname.split('/')[1];

  if (removeSidebarRoutes.includes(pathname)) {
    mainColumSize = 12;
    hideSidebar = true
  }
  
  if (token && !id)
    return <LinearProgress />
  
  return (
    <>
      <ToastContainer />
      <Header id={id} userImg={userImg}/>
      <Box component='main' sx={{ minHeight: "100vh"}}>
        <CssBaseline />
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} md={mainColumSize}>
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/signup" element={<SignupScreen />} />
                <Route path="/signin" element={<SigninScreen />} />
                <Route path="/recover" element={<RecoverPasswordScreen />} />
                <Route path="/event/:id" element={<EventScreen id={id}/>} />
                <Route path="/event/add" element={<AddEventScreen id={id}/>} />
                <Route path={"/profile/:id"} element={id ? <ProfileScreen userId={id} /> : <SigninScreen />} />
              </Routes>
            </Grid>
            {!hideSidebar ? <Grid item xs={12} md={4}>
              <SideBar/>
            </Grid> : ""}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

export default App;
