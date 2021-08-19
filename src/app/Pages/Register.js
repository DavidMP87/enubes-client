import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import BackgroundVideo from "../Videos/video_corporativo.mp4";
import { useHistory } from "react-router-dom";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplateNoReload,
  validateCaptcha,
} from "react-simple-captcha";
import validator from "validator";
import { config } from "../Config";
import axios from "axios";

const width = window.innerWidth;
const height = window.innerHeight - 2;

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#3D3D3D",
  },
  videoTag: {
    position: "absolute",
    width: width,
    height: height,
  },
  paper: {
    padding: 25,
    width: 350,
    zIndex: "1",
    opacity: "0.9",
    border: "1px #ffffff solid",
    borderRadius: 20,
    backgroundColor: "white",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Register() {
  const classes = useStyles();
  let history = useHistory();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [nameErrorMsg, setNameErrorMsg] = useState("");
  const [lastname, setLastname] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [lastnameErrorMsg, setLastnameErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [password1, setPassword1] = useState("");
  const [password1Error, setPassword1Error] = useState(false);
  const [password1ErrorMsg, setPassword1ErrorMsg] = useState("");
  const [captcha, setCaptcha] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaErrorMsg, setCaptchaErrorMsg] = useState(false);

  const handleName = (event) => {
    if (validator.isEmpty(event.target.value)) {
      setNameError(true);
      setNameErrorMsg("El nombre no puede estar vacio.");
    } else {
      setNameError(false);
      setNameErrorMsg("");
    }

    setName(event.target.value);
  };

  const handleLastname = (event) => {
    if (validator.isEmpty(event.target.value)) {
      setLastnameError(true);
      setLastnameErrorMsg("Los apellidos no pueden estar vacios.");
    } else {
      setLastnameError(false);
      setLastnameErrorMsg("");
    }

    setLastname(event.target.value);
  };

  const handleEmail = (event) => {
    if (validator.isEmail(event.target.value)) {
      setEmailError(false);
      setEmailErrorMsg("");
    } else {
      setEmailError(true);
      setEmailErrorMsg("Por favor introduce un email valido.");
    }

    setEmail(event.target.value);
  };

  const handleSubmit = () => {
    let isError = false;
    if (validator.isEmpty(name)) {
      setNameError(true);
      setNameErrorMsg("El nombre no puede estar vacio.");
      isError = true;
    }

    if (validator.isEmpty(lastname)) {
      setLastnameError(true);
      setLastnameErrorMsg("El nombre no puede estar vacio.");
      isError = true;
    }

    if (validator.isEmpty(email) || !validator.isEmail(email)) {
      setEmailError(true);
      setEmailErrorMsg("Por favor introduce un email valido.");
      isError = true;
    }

    if (validator.isEmpty(password)) {
      setPasswordError(true);
      setPasswordErrorMsg("La contraseña no puede estar vacia.");
      isError = true;
    }

    if (validator.isEmpty(password1)) {
      setPassword1Error(true);
      setPassword1ErrorMsg("La contraseña no puede estar vacia.");
      isError = true;
    }

    if (!captcha) {
      setCaptchaError(true);
      setCaptchaErrorMsg("El captcha es incorrecto.");
      isError = true;
    }

    if (!isError) {
      setNameError(false);
      setNameErrorMsg("");
      setLastnameError(false);
      setLastnameErrorMsg("");
      setEmailError(false);
      setEmailErrorMsg("");
      setPasswordError(false);
      setPasswordErrorMsg("");
      setPassword1Error(false);
      setPassword1ErrorMsg("");
      register();
    }
  };

  async function register() {
    const urlApi = config.endpoint + "enubes/set_user/";

    var postData = new FormData();
    postData.append("name", name);
    postData.append("lastname", lastname);
    postData.append("email", email);
    postData.append("password", password);
    axios
      .post(urlApi, postData)
      .then(function (response) {
        if (response.status === 200) {
          if (response.data.user === 0) {
            setEmailError(true);
            setEmailErrorMsg("El email ya existe.");
          } else {
            history.push("/registerok");
          }
        }
      })
      .catch(function (error) {
        console.log("error:", error);
      });
  }

  const handleLogin = () => {
    history.push("/");
  };

  const handleRecovery = () => {
    history.push("/recovery");
  };

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  return (
    <div className={classes.container}>
      <video className={classes.videoTag} autoPlay loop muted>
        <source src={BackgroundVideo} type="video/mp4" />
      </video>
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Registrarse
        </Typography>
        <TextField
          size="small"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Nombre"
          name="name"
          autoComplete="name"
          autoFocus
          error={nameError}
          helperText={nameErrorMsg}
          onChange={handleName}
        />
        <TextField
          size="small"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="last_name"
          label="Apellidos"
          name="last_name"
          autoComplete="last_name"
          autoFocus
          error={lastnameError}
          helperText={lastnameErrorMsg}
          onChange={handleLastname}
        />
        <TextField
          size="small"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          error={emailError}
          helperText={emailErrorMsg}
          onChange={handleEmail}
        />
        <TextField
          size="small"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Contraseña"
          type="password"
          id="password"
          autoComplete="current-password"
          error={passwordError}
          helperText={passwordErrorMsg}
          onChange={(e) => {
            setPassword(e.target.value);

            if (validator.isEmpty(e.target.value)) {
              setPasswordError(true);
              setPasswordErrorMsg("La contraseña no puede estar vacia.");
            } else {
              if (e.target.value !== password1) {
                setPasswordError(true);
                setPasswordErrorMsg("La contraseña no coinciden.");
                setPassword1ErrorMsg("La contraseña no coinciden.");
              } else {
                setPasswordError(false);
                setPasswordErrorMsg("");
                setPassword1Error(false);
                setPassword1ErrorMsg("");
              }
            }
          }}
        />
        <TextField
          size="small"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password1"
          label="Repite la contraseña"
          type="password"
          id="password1"
          autoComplete="current-password1"
          error={password1Error}
          helperText={password1ErrorMsg}
          onChange={(e) => {
            setPassword1(e.target.value);

            if (validator.isEmpty(e.target.value)) {
              setPassword1Error(true);
              setPassword1ErrorMsg("La contraseña no puede estar vacia.");
              setPasswordErrorMsg("La contraseña no coinciden.");
            } else {
              if (password !== e.target.value) {
                setPassword1Error(true);
                setPassword1ErrorMsg("La contraseña no coinciden.");
              } else {
                setPassword1Error(false);
                setPassword1ErrorMsg("");
                setPasswordError(false);
                setPasswordErrorMsg("");
              }
            }
          }}
        />
        <LoadCanvasTemplateNoReload style={{ marginLeft: 100 }} />
        <TextField
          size="small"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="user_captcha_input"
          label="Introduce el captcha"
          id="user_captcha_input"
          error={captchaError}
          helperText={captchaErrorMsg}
          onChange={(e) => {
            if (validateCaptcha(e.target.value, false)) {
              setCaptchaError(false);
              setCaptchaErrorMsg("");
              setCaptcha(true);
            } else {
              setCaptchaError(true);
              setCaptchaErrorMsg("El captcha es incorrecto.");
              setCaptcha(false);
            }
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleSubmit}
        >
          Registrarse
        </Button>
        <Grid container>
          <Grid item xs>
            <Link onClick={handleRecovery} variant="body2">
              ¿Se te olvidó tu contraseña?
            </Link>
          </Grid>
          <Grid item>
            <Link onClick={handleLogin} variant="body2">
              {"Iniciar sesión"}
            </Link>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
