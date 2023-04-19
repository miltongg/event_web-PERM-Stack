import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  Person,
  Mail,
  Smartphone,
  Facebook,
  Twitter,
  Instagram,
  Edit,
  Done,
  Public,
  YouTube,
  AddCircle,
  RemoveCircle,
  PhotoCamera,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IState } from "../interfaces/interfaces";
import { webApi } from "../helpers/animeApi";
import { getError } from "../helpers/handleErrors";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { setUserImg } from "../store/slices/user/userSlice";
import { USER_IMG_URL } from "../helpers/url";

interface Props {
  userId: string;
}

const ProfileScreen = ({ userId }: Props) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { id } = useParams<string>();
  const isFirstRender = useRef(true);

  const token = localStorage.getItem("token");

  const [user, setUser] = useState<IState>({
    cell: "",
    email: "",
    id: "",
    name: "",
    username: "",
    role: "",
    userImg: null,
    socials: [""],
  });
  let { name, username, email, role, cell, socials, userImg } = user;

  const [img, setImg] = useState<any>(null);

  const [editData, setEditData] = useState<any>({
    textData: "",
    socialsTextData: "",
    numberData: null,
    arrayData: [""],
  });

  const { textData, numberData, arrayData, socialsTextData } = editData;

  const [reload, setReload] = useState(false);
  const [update, setUpdate] = useState(false);

  const [toggle, setToggle] = useState({
    editEmail: false,
    editName: false,
    editUsername: false,
    editCell: false,
    editSocials: false,
    addSocial: false,
  });
  const {
    editEmail,
    editName,
    editUsername,
    editCell,
    editSocials,
    addSocial,
  } = toggle;

  // GET USER
  useEffect(() => {
    try {
      const fetchUser = async () => {
        const { data } = await webApi.get(`/user/${id}`, {
          headers: {
            token,
            "Content-Type": "application/json",
          },
        });
        delete data?.password;
        delete data?.token;
        setUser(data);
      };

      fetchUser();
    } catch (error: any) {
      getError(error);
    }
  }, [id]);


  // EDIT TOGGLE //
  const handleEditToggle = (key: string) => {
    switch (key) {
      case "email":
        setToggle(() => ({
          ...toggle,
          editEmail: !editEmail,
        }));
        break;
      case "name":
        setToggle(() => ({
          ...toggle,
          editName: !editName,
        }));
        break;
      case "username":
        setToggle(() => ({
          ...toggle,
          editUsername: !editUsername,
        }));
        break;
      case "cell":
        setToggle(() => ({
          ...toggle,
          editCell: !editCell,
        }));
        break;
      case "socials":
        setToggle(() => ({
          ...toggle,
          editSocials: !editSocials,
        }));
        break;
      default:
        break;
    }
  };


  // EDIT USER //
  const handleEdit = async () => {
    if (textData) setUser({ ...user, socials: [...user.socials!, textData] });

    setEditData({ ...editData, textData: "", socialsTextData: "" });
    setUpdate(!update);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // 👈️ return early if initial render
    }

    const update = async () => {
      try {
        // UPDATE USER DATA //
        await webApi.put(
          `/user/${id}`,
          {
            name,
            username,
            cell,
            socials,
            userImg,
          },
          {
            headers: {
              token,
              "Content-Type": "application/json",
            },
          }
        );

        // UPDATE COMMENT USERNAME IF USERNAME CHANGE //
        if (username) {
          await webApi.put(
            `comment/${id}`,
            {
              username,
            },
            {
              headers: { token },
            }
          );

          // UPDATE REPLIES USERNAME //
          await webApi.put(`reply/${id}`, {
            username,
          }, {
            headers: {token}
          })

          // UPDATE REPLIES REPLIED TO USERNAME
          await webApi.put(`reply/${id}`, {
            repliedToName: username,
          }, {
            headers: {token}
          })

          
        }

        setToggle({
          ...toggle,
          editName: false,
          editUsername: false,
          editEmail: false,
          editCell: false,
          editSocials: false,
          addSocial: false,
        });

        setReload(!reload);
        toast.success("Has actualizado tu perfil");
        setEditData({ ...editData, numberData: null });
      } catch (error) {
        toast.error(getError(error));
      }
    };

    update();
  }, [update]);


  // EDIT SOCIALS //
  const handleEditSocials = async (
    item?: string,
    newItem?: string,
    index?: number
  ) => {
    if (index !== undefined) {
      setEditData({ ...editData, numberData: index });
    } else if (item && newItem) {
      const editedSocial = socials?.map((i) => (i === item ? newItem : i));
      setUser({ ...user, socials: editedSocial });

      handleEdit();
    }
  };

  // DELETE SOCIAL //
  const handleDelete = async (social: string) => {
    Confirm.show(
      `¿Deseas borrar el enlace?`,
      `${social}`,
      "Si",
      "No",
      () => {
        delFunc();
      },
      () => {},
      {
        titleColor: "black",
        okButtonBackground: "orange",
        titleFontSize: "20px",
        messageFontSize: "16px",
      }
    );
    const delFunc = () => {
      const newArray = socials?.filter((el) => el !== social);
      setUser({ ...user, socials: newArray });
      handleEdit();
    };
  };

  // CHANGE IMG //
  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImg(file);
  };

  // EDIT SOCIAL //
  const editSingleSocial = (index: number, item: string) => {
    setEditData({ ...editData, socialsTextData: item });
    handleEditSocials("", "", index);
  };

  // UPLOAD IMG AND UPDATE //
  useEffect(() => {
    if (img) {
      const uploadImg = async () => {
        let fileData = new FormData();
        fileData.append("file", img);
        // const {file} = Object.fromEntries(fileData)

        const nameEntry = fileData.get("file");
        // const imgName = nameEntry instanceof File ? nameEntry.name : "";

        try {
          // UPLOAD PHOTO //
          const { data } = await webApi.post("/iupload", fileData, {
            headers: {
              token,
              folder: "avatar/",
              prefix: 'user',
              id: userId,
            },
          });

          // UPDATE USER PHOTO //
          await webApi.put(
            `/user/${id}`,
            { userImg: data.image },
            {
              headers: { id, token },
            }
          );

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
          await webApi.put(`reply/${id}`, {
            userImg: data.image
          }, {
            headers: {token}
          })

          dispatch(setUserImg({ userImg: data.image }));
          setUser({ ...user, userImg: data.image });
        } catch (error) {
          toast.error(getError(error));
        }
      };

      uploadImg();
    }
  }, [img]);

  return email !== "" ? (
    <Paper elevation={3}>
      <Grid container spacing={0} sx={{ marginTop: 5 }}>
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
          <Box sx={{ marginX: "auto", marginY: "20px", position: "relative" }}>
            {userImg ? (
              <Paper
                elevation={5}
                component="img"
                sx={{
                  objectFit: "cover",
                  height: 200,
                  width: 200,
                  borderRadius: "50%",
                }}
                src={`${USER_IMG_URL}${id}/${userImg}`}
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
            {editName ? (
              <>
                <TextField
                  variant="standard"
                  autoFocus
                  sx={{
                    marginY: 1,
                    input: { color: "white", fontSize: "24px" },
                  }}
                  value={name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
                <Done
                  onClick={handleEdit}
                  fontWeight={500}
                  sx={{
                    color: "orange",
                    marginLeft: 1,
                    "&:hover": {
                      cursor: "pointer",
                      color: "black",
                    },
                  }}
                />
              </>
            ) : (
              <Typography color="white" sx={{ marginY: 1 }} variant="h5">
                {name}
              </Typography>
            )}
            {userId === id ? (
              <Edit
                onClick={() => handleEditToggle("name")}
                sx={{
                  color: "orange",
                  marginLeft: 1,
                  marginY: 1,
                  "&:hover": {
                    cursor: "pointer",
                    color: "black",
                  },
                }}
              />
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
            {editUsername ? (
              <>
                <TextField
                  autoFocus
                  variant="standard"
                  sx={{
                    marginY: 1,
                    input: { color: "white", fontSize: "24px" },
                  }}
                  value={username}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                />
                <Done
                  onClick={handleEdit}
                  fontWeight={500}
                  sx={{
                    color: "orange",
                    marginLeft: 1,
                    "&:hover": {
                      cursor: "pointer",
                      color: "black",
                    },
                  }}
                />
              </>
            ) : (
              <Typography color="white" sx={{ marginY: 1 }} variant="h5">
                {username}
              </Typography>
            )}
            {userId === id ? (
              <Edit
                onClick={() => handleEditToggle("username")}
                sx={{
                  color: "orange",
                  marginLeft: 1,
                  marginY: 1,
                  "&:hover": {
                    cursor: "pointer",
                    color: "black",
                  },
                }}
              />
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
                <Mail sx={{ marginRight: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Correo
                </Typography>
              </ListItem>
              <ListItem sx={{ marginTop: 1 }}>{email}</ListItem>
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
                {editCell ? (
                  <>
                    <PhoneInput
                      country={"cu"}
                      value={cell}
                      inputProps={{ autoFocus: true }}
                      onChange={(cell) => setUser({ ...user, cell })}
                      inputStyle={{
                        width: "fit-content",
                      }}
                    />
                    <Done
                      onClick={handleEdit}
                      fontWeight={500}
                      sx={{
                        color: "orange",
                        marginLeft: 1,
                        "&:hover": {
                          cursor: "pointer",
                          color: "black",
                        },
                      }}
                    />
                  </>
                ) : (
                  <Typography>{cell}</Typography>
                )}
                {userId === id ? (
                  <Edit
                    onClick={() => handleEditToggle("cell")}
                    sx={{
                      color: "orange",
                      marginLeft: 1,
                      marginY: 1,
                      "&:hover": {
                        cursor: "pointer",
                        color: "black",
                      },
                    }}
                  />
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
            {socials?.map((item, index) => (
              <ListItem key={index}>
                {index === numberData ? (
                  <>
                    <TextField
                      variant="standard"
                      value={socialsTextData}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          socialsTextData: e.target.value,
                        })
                      }
                    />
                    <Done
                      onClick={() =>
                        !socialsTextData
                          ? toast.error("Campo vacío")
                          : handleEditSocials(item, socialsTextData)
                      }
                      fontWeight={500}
                      sx={{
                        color: "orange",
                        marginLeft: 1,
                        "&:hover": {
                          cursor: "pointer",
                          color: "black",
                        },
                      }}
                    />
                  </>
                ) : item.includes("facebook") ? (
                  <>
                    <Facebook sx={{ marginRight: 1 }} />
                    {item}
                  </>
                ) : item.includes("twitter") ? (
                  <>
                    <Twitter sx={{ marginRight: 1 }} />
                    {item}
                  </>
                ) : item.includes("instagram") ? (
                  <>
                    <Instagram sx={{ marginRight: 1 }} />
                    {item}
                  </>
                ) : item.includes("youtube") ? (
                  <>
                    <YouTube sx={{ marginRight: 1 }} />
                    {item}
                  </>
                ) : (
                  <>
                    <Public sx={{ marginRight: 1 }} />
                    {item}
                  </>
                )}
                {userId === id ? (
                  <>
                    <Edit
                      sx={{
                        marginX: 1,
                        color: "orange",
                        "&:hover": { cursor: "pointer", color: "black" },
                      }}
                      onClick={() => editSingleSocial(index, item)}
                    />
                    <RemoveCircle
                      sx={{
                        color: "red",
                        "&:hover": { cursor: "pointer", color: "black" },
                      }}
                      onClick={() => handleDelete(item)}
                    />
                  </>
                ) : (
                  <></>
                )}
              </ListItem>
            ))}
            {editSocials ? (
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
                  value={textData}
                  autoFocus={true}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      textData: e.target.value.trim(),
                    })
                  }
                />
                <Done
                  onClick={() =>
                    !textData ? toast.error("Campo vacío") : handleEdit()
                  }
                  fontWeight={500}
                  sx={{
                    color: "orange",
                    marginLeft: 1,
                    "&:hover": {
                      cursor: "pointer",
                      color: "black",
                    },
                  }}
                />
              </ListItem>
            ) : id === userId ? (
              <ListItem
                onClick={() => handleEditToggle("socials")}
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
  ) : (
    <CircularProgress
      size={50}
      sx={{
        color: "orange",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: "auto",
      }}
    />
  );
};

export default ProfileScreen;
