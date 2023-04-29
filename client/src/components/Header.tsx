import { MouseEvent, useEffect, useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Menu,
  Tooltip,
  Avatar,
  MenuItem,
} from "@mui/material";
import {
  ContactPage,
  Event,
  Home,
  Login,
  Widgets,
  Newspaper,
  PersonAdd,
  Logout,
  Person,
  AssignmentInd,
} from "@mui/icons-material";
import { useNavigate, NavLink } from "react-router-dom";
import { IState } from "../interfaces/interfaces";
import { webApi } from "../helpers/animeApi";
import { getError } from "../helpers/handleErrors";
import { toast } from "react-toastify";
import { USER_IMG_URL } from "../helpers/url";

const drawerWidth = 200;

const navStyles = {
  color: "inherit",
  display: "flex",
  fontFamily: "Roboto",
  textDecoration: "none",
  "&:hover": {
    color: "grey.500",
    backgroundColor: "inherit",
  },
  "&.active": {
    color: "text.secondary",
    backgroundColor: "inherit",
  },
};

const leftLinks = [
  { title: "Inicio", icon: <Home />, path: "/" },
  { title: "Eventos", icon: <Event />, path: "/event" },
  { title: "Noticias", icon: <Newspaper />, path: "/news" },
  { title: "Contacto", icon: <ContactPage />, path: "/contact" },
];

const rightLinks = [
  { title: "Registrarse", icon: <PersonAdd />, path: "/signup" },
  { title: "Autenticarse", icon: <Login />, path: "/signin" },
];

export default function Header({ id, userImg }: IState) {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const handleSignout = async () => {
    try {
      await webApi.post(
        "/signout",
        {},
        {
          headers: {
            id,
            token: localStorage.getItem("token"),
          },
        }
      );
      localStorage.removeItem("token");
      window.location.href = "/signin";
    } catch (error: any) {
      toast.error(getError(error));
      console.log(error);
    }
  };

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MATSURI
      </Typography>
      <Divider />
      <List>
        {leftLinks.map(({ title, icon, path }) => (
          <ListItem component={NavLink} key={path} to={path} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={icon} secondary={title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", marginBottom: 8 }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ backgroundColor: "orange" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <Widgets />
          </IconButton>
          <Button
            variant="text"
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
              color: "inherit",
              fontSize: "20px",
            }}
            onClick={() => navigate("/")}
          >
            MATSURI
          </Button>
          <Box
            sx={{
              flexGrow: 20,
              display: "flex",
              justifyContent: { xs: "end", sm: "end", md: "space-between" },
            }}
          >
            <List sx={{ display: { xs: "none", sm: "none", md: "flex" } }}>
              {leftLinks.map(({ title, icon, path }) => (
                <ListItem
                  component={NavLink}
                  key={path}
                  to={path}
                  sx={navStyles}
                >
                  {icon}&nbsp;{title}
                </ListItem>
              ))}
            </List>
            {!localStorage.getItem("token") ? (
              <List sx={{ display: { xs: "none", sm: "none", md: "flex" } }}>
                {rightLinks.map(({ title, icon, path }) => (
                  <ListItem
                    component={NavLink}
                    key={path}
                    to={path}
                    sx={navStyles}
                  >
                    {icon}&nbsp;{title}
                  </ListItem>
                ))}
              </List>
            ) : (
              <List sx={{ display: "flex" }}>
                <ListItem sx={navStyles} component={NavLink} to={"/dashboard"}>
                  <AssignmentInd /> Administrar
                </ListItem>
                <Tooltip title="Menú">
                  {userImg ? (
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Box
                        component="img"
                        sx={{
                          objectFit: "cover",
                          height: 42,
                          width: 42,
                          borderRadius: "50%",
                        }}
                        src={`${USER_IMG_URL}${id}/${userImg}`}
                      />
                    </IconButton>
                  ) : (
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar>
                        <Person />
                      </Avatar>
                    </IconButton>
                  )}
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <ListItem
                      component={NavLink}
                      to={`/profile/${id}`}
                      sx={{
                        color: "inherit",
                        "&:active": { textDecoration: "none" },
                      }}
                    >
                      <PersonAdd sx={{ marginRight: 1 }} /> Perfil
                    </ListItem>
                  </MenuItem>
                  <Divider />
                  <MenuItem>
                    <ListItem
                      component={Button}
                      onClick={handleSignout}
                      sx={{
                        color: "inherit",
                        "&:active": { textDecoration: "none" },
                      }}
                    >
                      <Logout sx={{ marginRight: 1 }} /> Salir
                    </ListItem>
                  </MenuItem>
                </Menu>
              </List>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
