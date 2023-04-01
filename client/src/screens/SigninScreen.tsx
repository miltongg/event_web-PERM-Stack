import { useState, FormEvent } from "react";
import {
  Box,
  LinearProgress,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  IconButton,
  TextField,
  Input,
  Typography,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { webApi } from "../helpers/animeApi";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";
import { useNavigate } from "react-router-dom";

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

interface Props {
  userId: string;
}

const SigninScreen = () => {
  const [formState, setFormState] = useState({
    showPassword: false,
    loading: false,
  });

  const { showPassword, loading } = formState;

  const handleClickShowPassword = () =>
    setFormState((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));

  const navigate = useNavigate();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setFormState({ ...formState, loading: true });

      const formData = new FormData(event.currentTarget);

      const { data } = await webApi.post("/signin", {
        email: formData.get("email"),
        password: formData.get("password"),
      });

      localStorage.setItem("token", data);

      navigate("/");
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
          Autenticar
        </Typography>

        <TextField
          id="email"
          label="Correo"
          name="email"
          type="email"
          variant="standard"
          sx={{ marginY: 2 }}
        />

        <FormControl sx={{ marginY: 2 }} variant="standard">
          <InputLabel htmlFor="standard-adornment-password">
            Contraseña
          </InputLabel>
          <Input
            id="password"
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

        <Box sx={{ marginTop: 3, marginBottom: 2 }}>
          {loading ? <LinearProgress color="warning" /> : ""}
          <Button
            disabled={loading}
            variant="contained"
            type="submit"
            sx={{
              width: 1,
              mt: 1,
              backgroundColor: "orange",
              "&:hover": {
                backgroundColor: "darkorange",
              },
            }}
          >
            Acceder
          </Button>
          <Link
            underline="none"
            sx={{ mt: 4 }}
            component="button"
            onClick={() => navigate("/recover")}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </Box>
      </FormControl>
    </Box>
  );
};

export default SigninScreen;
