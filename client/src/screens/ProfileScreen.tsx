import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IState } from "../interfaces/interfaces";
import { webApi } from "../helpers/animeApi";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";
import Loading from "../components/Loading";
import {
  Backdrop,
  Box,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { USER_IMG_URL } from "../helpers/url";
import {
  AddCircle,
  Done,
  Edit,
  Facebook,
  Instagram,
  Mail,
  Person,
  PhotoCamera,
  Public,
  RemoveCircle,
  Smartphone,
  Twitter,
  YouTube,
} from "@mui/icons-material";
import EditButton from "../components/ProfileEditButton";
import DoneButton from "../components/ProfileDoneButton";
import { setUserImg } from "../store/slices/user/userSlice";
import { useDispatch } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import update = toast.update;

interface Props {
  userId: string;
}

const ProfileScreen = ({ userId }: Props) => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const [user, setUser] = useState<IState>({
    id: "",
    name: "",
    username: "",
    email: "",
    role: "",
    userImg: "",
    socials: [],
  });

  const [editSocial, setEditSocial] = useState<{
    text: string;
    socials: string[];
    index: number | null;
  }>({
    text: "",
    socials: [],
    index: null,
  });

  const [loading, setLoading] = useState(false);
  const [dontLoadUseEffect, setdontLoadEffect] = useState(true);
  const [update, setUpdate] = useState(false);

  // TOGGLE STATE //
  const [toggleEdit, setToggleEdit] = useState<{
    name: boolean;
    username: boolean;
    cell: boolean;
    socials: boolean;
  }>({
    name: false,
    username: false,
    cell: false,
    socials: false,
  });

  // TOGGLE EDIT //
  const handleToggleEdit = (key: string) => {
    switch (key) {
      case "name":
        setToggleEdit({ ...toggleEdit, name: !toggleEdit.name });
        break;
      case "username":
        setToggleEdit({ ...toggleEdit, username: !toggleEdit.username });
        break;
      case "cell":
        setToggleEdit({ ...toggleEdit, cell: !toggleEdit.cell });
        break;
      case "socials":
        setToggleEdit({ ...toggleEdit, socials: !toggleEdit.socials });
        break;

      default:
        break;
    }
  };

  // GET USER //
  useEffect(() => {
    try {
      const getUser = async () => {
        const { data } = await webApi.get(`/user/${id}`, {
          headers: { token },
        });

        setUser(data);
        setLoading(false);
      };

      getUser();
      setdontLoadEffect(false);
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  }, []);

  // UPDATE USER //
  const handleUpdateUser = async () => {
    try {
      setLoading(true);

      await webApi.put(
        `user/${id}`,
        {
          user,
        },
        { headers: { token } }
      );

      setToggleEdit({
        ...toggleEdit,
        name: false,
        username: false,
        cell: false,
        socials: false,
      });
      setLoading(false);
      setEditSocial({ ...editSocial, text: "", index: null });
      setToggleEdit({ ...toggleEdit, socials: false });

      toast.success("Perfil actualizado");
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  };

  // UPLOAD IMAGE //
  const handleImgChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setLoading(true);

    const fileData = new FormData();
    fileData.append("file", file);

    try {
      const { data } = await webApi.post("/iupload", fileData, {
        headers: { token, folder: "avatar/", prefix: "user", id: userId },
      });

      // UPDATE USER IMG IN DB //
      await webApi.put(
        `user/${id}`,
        {
          userImg: data.image,
        },
        { headers: { id: userId, token } }
      );

      setUser({ ...user, userImg: data.image });
      dispatch(setUserImg({ userImg: data.image }));
      setLoading(false);

      // UPDATE COMMENT PHOTO //
      await webApi.put(
        `/comment/${id}`,
        {
          userImg: data.image,
        },
        {
          headers: { token },
        }
      );

      // UPDATE REPLIED PHOTO //
      await webApi.put(
        `reply/${id}`,
        {
          userImg: data.image,
        },
        {
          headers: { token },
        }
      );
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  };

  useEffect(() => {
    if (dontLoadUseEffect) return;
    else handleUpdateUser();
  }, [update]);

  const handleDeleteSocial = async (social: string) => {
    Confirm.show(
      `¿Deseas borrar el enlace?`,
      `${social}`,
      "Si",
      "No",
      () => {
        const newArray = user.socials?.filter((s) => s !== social);
        setUser({ ...user, socials: newArray });
        setUpdate(!update);
      },
      () => {},
      {
        titleColor: "black",
        okButtonBackground: "orange",
        titleFontSize: "20px",
        messageFontSize: "16px",
      }
    );
  };

  return (
    <>
      {loading ? (
        <Backdrop open={loading} sx={{ zIndex: 1 }}>
          <Loading />
        </Backdrop>
      ) : (
        ""
      )}
      {!user.id ? (
        ""
      ) : (
        <Paper elevation={3}>
          <Grid container spacing={0} sx={{ mt: 5 }}>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                background:
                  "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
                textAlign: "center",
                borderRadius: "5px 0 0 5px",
              }}
            >
              <Box sx={{ mx: "auto", my: "20px", position: "relative" }}>
                {user.userImg ? (
                  <Paper
                    elevation={5}
                    component="img"
                    sx={{
                      objectFit: "cover",
                      height: 200,
                      width: 200,
                      borderRadius: "50%",
                    }}
                    src={`${USER_IMG_URL}${id}/${user.userImg}`}
                  />
                ) : (
                  <Person sx={{ width: 200, height: 200 }} />
                )}
                <IconButton
                  sx={{ position: "absolute", top: -5 }}
                  aria-label="upload picture"
                  component="label"
                >
                  <input
                    hidden
                    type="file"
                    name="img"
                    id="imgFile"
                    onChange={handleImgChange}
                  />
                  <PhotoCamera sx={{ color: "white" }} />
                </IconButton>
              </Box>
              <ListItem
                sx={{
                  justifyContent: "center",
                  margin: "auto",
                  width: "fit-content",
                }}
              >
                {toggleEdit.name ? (
                  <>
                    <TextField
                      variant="standard"
                      autoFocus
                      sx={{
                        marginY: 1,
                        input: { color: "white", fontSize: "24px" },
                      }}
                      value={user.name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                    />
                    <DoneButton activate={() => handleUpdateUser()} />
                  </>
                ) : (
                  <Typography color="white" sx={{ marginY: 1 }} variant="h5">
                    {user.name}
                  </Typography>
                )}
                {userId === id ? (
                  <EditButton activate={() => handleToggleEdit("name")} />
                ) : (
                  <></>
                )}
              </ListItem>
              <ListItem
                sx={{
                  justifyContent: "center",
                  margin: "auto",
                  width: "fit-content",
                }}
              >
                {toggleEdit.username ? (
                  <>
                    <TextField
                      autoFocus
                      variant="standard"
                      sx={{
                        marginY: 1,
                        input: { color: "white", fontSize: "24px" },
                      }}
                      value={user.username}
                      onChange={(e) =>
                        setUser({ ...user, username: e.target.value })
                      }
                    />
                    <DoneButton activate={() => handleUpdateUser()} />
                  </>
                ) : (
                  <Typography color="white" sx={{ marginY: 1 }} variant="h5">
                    {user.username}
                  </Typography>
                )}
                {userId === id ? (
                  <EditButton activate={() => handleToggleEdit("username")} />
                ) : (
                  <></>
                )}
              </ListItem>
            </Grid>
            <Grid
              item
              xs={12}
              md={8}
              sx={{
                backgroundColor: "#fbfbfb",
                borderRadius: "0 5px 5px 0",
                paddingY: 5,
                paddingX: { xs: 2, sm: 5, md: 10, ld: 15 },
              }}
            >
              <Typography variant="h6">Tu información</Typography>
              <Divider />

              <Box
                sx={{
                  display: { sm: "block", md: "flex", lg: "flex" },
                  justifyContent: "space-between",
                  marginTop: 2,
                }}
              >
                <Box>
                  <ListItem>
                    <Mail sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Correo
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ mt: 1 }}>{user.email}</ListItem>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <ListItem>
                    <Smartphone sx={{ marginRight: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Teléfono
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ width: "fit-content" }}>
                    {toggleEdit.cell ? (
                      <>
                        <PhoneInput
                          country={"cu"}
                          value={user.cell}
                          inputProps={{ autoFocus: true }}
                          onChange={(cell) => setUser({ ...user, cell })}
                          inputStyle={{
                            width: "fit-content",
                          }}
                        />
                        <DoneButton activate={() => handleUpdateUser()} />
                      </>
                    ) : (
                      <Typography>{user.cell}</Typography>
                    )}
                    {userId === id ? (
                      <EditButton activate={() => handleToggleEdit("cell")} />
                    ) : (
                      <></>
                    )}
                  </ListItem>
                </Box>
              </Box>
              <Typography marginTop={5} variant="h6">
                Redes Sociales
              </Typography>
              <Divider />
              <List sx={{ marginTop: 2 }}>
                {user.socials?.map((social, index) => (
                  <ListItem key={index}>
                    {index === editSocial.index ? (
                      <>
                        <TextField
                          variant="standard"
                          value={editSocial.text}
                          onChange={(e) =>
                            setEditSocial({
                              ...editSocial,
                              text: e.target.value.trim(),
                            })
                          }
                        />
                        <DoneButton
                          activate={() => {
                            setUser({
                              ...user,
                              socials: user.socials!.map((s) =>
                                s === social ? editSocial.text : s
                              ),
                            });
                            setUpdate(!update);
                          }}
                        />
                      </>
                    ) : social.includes("facebook") ? (
                      <>
                        <Facebook sx={{ marginRight: 1, color: "#1877f2" }} />
                        <Link to={social} target="_blank">
                          {social}
                        </Link>
                      </>
                    ) : social.includes("twitter") ? (
                      <>
                        <Twitter sx={{ marginRight: 1, color: "#1DA1F2" }} />
                        <Link to={social}>{social}</Link>
                      </>
                    ) : social.includes("instagram") ? (
                      <>
                        <Instagram sx={{ marginRight: 1, color: "#E4405F" }} />
                        <Link to={social}>{social}</Link>
                      </>
                    ) : social.includes("youtube") ? (
                      <>
                        <YouTube sx={{ marginRight: 1, color: "red" }} />
                        <Link to={social}>{social}</Link>
                      </>
                    ) : (
                      <>
                        <Public sx={{ marginRight: 1, color: "gray" }} />
                        <Link to={social} target="_blank">
                          {social}
                        </Link>
                      </>
                    )}
                    {userId === id ? (
                      <>
                        <EditButton
                          activate={() =>
                            setEditSocial({
                              ...editSocial,
                              index,
                              text: social,
                            })
                          }
                        />
                        <IconButton onClick={() => handleDeleteSocial(social)}>
                          <RemoveCircle
                            sx={{
                              color: "red",
                              "&:hover": { cursor: "pointer", color: "black" },
                            }}
                          />
                        </IconButton>
                      </>
                    ) : (
                      <></>
                    )}
                  </ListItem>
                ))}
                {toggleEdit.socials ? (
                  <ListItem
                    sx={{
                      marginTop: 1,
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  >
                    <TextField
                      variant="standard"
                      value={editSocial.text}
                      autoFocus={true}
                      onChange={(e) =>
                        setEditSocial({
                          ...editSocial,
                          text: e.target.value.trim(),
                        })
                      }
                    />
                    <DoneButton
                      activate={() => {
                        setUser({
                          ...user,
                          socials: [...user.socials!, editSocial.text],
                        });
                        setUpdate(!update);
                      }}
                    />
                  </ListItem>
                ) : id === userId ? (
                  <ListItem
                    onClick={() => handleToggleEdit("socials")}
                    sx={{
                      color: "orange",
                      marginTop: 2,
                      width: 190,
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  >
                    <AddCircle sx={{ marginRight: 1 }} />
                    <Typography>Añadir red social</Typography>
                  </ListItem>
                ) : (
                  <></>
                )}
              </List>
            </Grid>
          </Grid>
        </Paper>
      )}
    </>
  );
};

export default ProfileScreen;
