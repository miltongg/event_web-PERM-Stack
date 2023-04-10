import { useNavigate } from "react-router-dom";
import { VisibilityOff, Visibility, Send } from "@mui/icons-material";
import {
  Box,
  FormControl,
  Typography,
  TextField,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  LinearProgress,
  Button,
  Link,
} from "@mui/material";
import { useState, FormEvent, MouseEventHandler, MouseEvent } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { webApi } from "../helpers/animeApi";
import { getError } from "../helpers/handleErrors";
import decodeToken from "../libs/decodeToken";

const formStyle = {
  boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
  width: "400px",
  margin: "auto",
  padding: 3,
  borderRadius: 1,
  backgroundColor: "white",
  borderTop: "solid 5px orange",
  textAlign: "center",
};

const RecoverPasswordScreen = () => {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    showPassword: false,
    dataSent: false,
    loading: false,
  });

  const { showPassword, dataSent, loading } = formState;

  const dispatch = useDispatch();
  const handleClickShowPassword = () =>
    setFormState((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));

  const navigate = useNavigate();

  // sent code to email
  const handleSentEmail = async (e: MouseEvent) => {
    console.log(formState.email);

    try {
      await webApi.post(
        "/mail",
        {
          email: formState.email,
        },
        {}
      );

      toast.success("Un código de verificación ha sido enviado a su correo");
    } catch (error: any) {
      toast.error(getError(error));
    }
  };

  // submit form
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setFormState({ ...formState, loading: true });

      const data = new FormData(event.currentTarget);

      await webApi.post("/signup", {
        name: data.get("name"),
        username: data.get("username"),
        email: data.get("email"),
        password: data.get("password"),
        confirmPassword: data.get("password2"),
      });

      toast.success("Por favor, revise su correo");
      setFormState({ ...formState, dataSent: true });
    } catch (error: any) {
      toast.error(getError(error));
      setFormState({ ...formState, loading: false });
      console.log(error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", height: "100vh" }}
    >
      <FormControl sx={formStyle}>
        <Typography variant="h5" sx={{ textAlign: "center", color: "orange" }}>
          Cambiar Contraseña
        </Typography>

        <FormControl sx={{ marginY: 2 }} variant="standard">
          <InputLabel required htmlFor="standard-adornment-password">
            Correo
          </InputLabel>
          <Input
            id="email"
            required
            type="email"
            name="email"
            onChange={(e) =>
              setFormState({ ...formState, email: e.target.value })
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleSentEmail}>
                  <Send />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <TextField
          required
          id="code"
          label="Código"
          name="code"
          type="text"
          variant="standard"
          sx={{ marginY: 2 }}
        />

        <FormControl sx={{ marginY: 2 }} variant="standard">
          <InputLabel required htmlFor="standard-adornment-password">
            Contraseña
          </InputLabel>
          <Input
            id="password"
            required
            type={showPassword ? "text" : "password"}
            name="password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  // onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl sx={{ marginY: 2 }} variant="standard">
          <InputLabel required htmlFor="standard-adornment-password">
            Repita la Contraseña
          </InputLabel>
          <Input
            id="password2"
            type={showPassword ? "text" : "password"}
            name="password2"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  // onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <Box sx={{ marginTop: 3, marginBottom: 2 }}>
          {loading ? <LinearProgress color="warning" /> : ""}
          <Button
            disabled={loading}
            variant="contained"
            type="submit"
            sx={{
              width: 1,
              mt: 1,
              mb: 3,
              backgroundColor: "orange",
              "&:hover": {
                backgroundColor: "darkorange",
              },
            }}
          >
            Enviar
          </Button>
        </Box>
      </FormControl>
    </Box>
  );
};

export default RecoverPasswordScreen;
