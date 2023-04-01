import {useState, FormEvent} from "react";
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
  Typography, Link,
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {webApi} from "../helpers/animeApi";
import {toast} from "react-toastify";
import {getError} from "../helpers/handleErrors";
import {useNavigate} from "react-router-dom";
import { PinInput } from 'react-input-pin-code';
import {useDispatch} from "react-redux";
import decodeToken from "../libs/decodeToken";

const formStyle = {
  boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
  width: "400px",
  margin: "auto",
  padding: 3,
  borderRadius: 1,
  backgroundColor: "white",
  borderTop: "solid 5px orange",
  textAlign: "center"
}

const SignupScreen = () => {
  
  
  const [formState, setFormState] = useState({
    showPassword: false,
    dataSent: false,
    loading: false
  });
  const [values, setValues] = useState(['', '', '', '', '', ''])
  
  const {showPassword, dataSent, loading} = formState;
  
  const dispatch = useDispatch();
  const handleClickShowPassword = () => setFormState((prevState) => ({
    ...prevState,
    showPassword: !prevState.showPassword
  }))
  
  const navigate = useNavigate();
  
  // useEffect(() => {
  //   setDataSent(true)
  // }, [dataSent]);
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    try {
      
      setFormState({...formState, loading: true});
      
      const data = new FormData(event.currentTarget);
  
      await webApi.post('/signup', {
        name: data.get('name'),
        username: data.get('username'),
        email: data.get('email'),
        password: data.get('password'),
        confirmPassword: data.get('password2')
      })
      
      toast.success('Por favor, revise su correo')
      setFormState({...formState, dataSent: true})
      
    } catch (error: any) {
      toast.error(getError(error));
      setFormState({...formState, loading: false})
      console.log(error);
    }
  }
  
  const handleVerify = async () => {
    
    try {
      
      const {data} = await webApi.post('/verify', {
        code: values.join('')
      })
      
      toast.success('Su correo ha sido verificado correctamente')
      
      localStorage.setItem("token", data)
      
      const {id} = await decodeToken(data)
      
      navigate(`/profile/${id}`)
      
    } catch (error: any) {
      toast.error(getError(error))
      console.log(error)
    }
  }
  
  return (
      <Box component="form" onSubmit={handleSubmit} sx={{display: "flex", height: "100vh"}}>
        {
          !dataSent ? <FormControl sx={formStyle}>
            <Typography variant="h5" sx={{textAlign: "center", color: "orange"}}>Crear Cuenta</Typography>
      
            <TextField
              required
              id="name"
              name="name"
              label="Nombre"
              variant="standard"
              sx={{marginY: 2}}
            />

            <TextField
              required
              id="username"
              name="username"
              label="Alias"
              variant="standard"
              sx={{marginY: 2}}
            />
      
            <TextField
              required
              id="email"
              label="Correo"
              name="email"
              type="email"
              variant="standard"
              sx={{marginY: 2}}
            />
      
            <FormControl sx={{marginY: 2}} variant="standard">
              <InputLabel required htmlFor="standard-adornment-password">Contraseña</InputLabel>
              <Input
                id="password"
                required
                type={showPassword ? 'text' : 'password'}
                name="password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      // onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
      
            <FormControl sx={{marginY: 2}} variant="standard">
              <InputLabel required htmlFor="standard-adornment-password">Repita la Contraseña</InputLabel>
              <Input
                id="password2"
                type={showPassword ? 'text' : 'password'}
                name="password2"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      // onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
    
            <Box sx={{marginTop: 3, marginBottom: 2}}>
              {loading ? <LinearProgress color="warning"/> : ""}
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
                    backgroundColor: "darkorange"
                  }
                }}
              >
                Registrar
              </Button>
              <Link
                underline="none"
                sx={{'&:hover': {cursor: 'pointer', color: 'blue'}}}
                onClick={() => navigate('/signin')}
              >
                ¿Ya tienes una cuenta?
              </Link>
            </Box>
            
        </FormControl> :
          
          <Box sx={formStyle}>
            <Typography color="orange" mb="10px" mt="-10px" textAlign="center" variant="h6">Copie el código aquí.</Typography>
            <Box sx={{display: "flex", width: 1, textAlign: "center", justifyContent: "center"}}>
              <PinInput
                placeholder=""
                values={values}
                type={'text'}
                onChange={(value, index, values) => setValues(values)}
              />
            </Box>
  
            <Button
              variant="contained"
              sx={{
                textAlign: "center",
                marginTop: 3,
                backgroundColor: "orange",
                "&:hover": {
                  backgroundColor: "darkorange"
                }
              }}
              onClick={handleVerify}
            >
              Verificar
            </Button>
            
          </Box>
          
        }
        
      </Box>
  );
};

export default SignupScreen;
