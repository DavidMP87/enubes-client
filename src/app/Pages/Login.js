import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import BackgroundVideo from "../Videos/video_corporativo.mp4";
import { useHistory } from "react-router-dom";
import validator from "validator";
import CircularProgress from "@material-ui/core/CircularProgress";
import { config } from "../Config";
import axios from "axios";

const width = window.innerWidth;
const height = window.innerHeight - 2;

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://www.enubes.com/">
        {" "}
        {new Date().getFullYear()}
        {"eNubes."}
      </Link>
    </Typography>
  );
}

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
  loading: {
    padding: 25,
    width: 70,
    zIndex: "1",
    opacity: "0.9",
    border: "1px #ffffff solid",
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
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

export default function Login() {
  const classes = useStyles();
  let history = useHistory();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmail = (event) => {
    if (validator.isEmail(event.target.value)) {
      setEmailError(false);
      setEmailErrorMsg("");
      setEmail(event.target.value);
    } else {
      setEmailError(true);
      setEmailErrorMsg("Por favor introduce un email valido.");
    }
  };

  const handlePassword = (event) => {
    if (validator.isEmpty(event.target.value)) {
      setPasswordError(true);
      setPasswordErrorMsg("La contraseña no puede estar vacia.");
      setPassword(event.target.value);
    } else {
      setPasswordError(false);
      setPasswordErrorMsg("");
      setPassword(event.target.value);
    }
  };

  const handleSubmit = () => {
    let isError = false;
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

    if (!isError) {
      setLoading(true);
      login();
    }
  };

  async function login() {
    const urlApi = config.endpoint + "enubes/get_user/";

    var postData = new FormData();
    postData.append("email", email);
    postData.append("password", password);
    axios
      .post(urlApi, postData)
      .then(function (response) {
        if (response.status === 200) {
          if (response.data.user === 0) {
            setEmailError(true);
            setEmailErrorMsg("El email o la contraseña no son correctos.");
            setPasswordError(true);
            setPasswordErrorMsg("El email o la contraseña no son correctos.");
          }
          if (response.data.user === 1) {
            //CUENTA NO CONFRIMADA
            setPasswordError(true);
            setPasswordErrorMsg(
              "La cuenta no a sido verificada, por favor revisa tu correo."
            );
          }

          if (response.data.user !== 0 && response.data.user !== 1) {
            localStorage.setItem("user", JSON.stringify(response.data.user[0]));
            history.push("/home");
          }
        }
      })
      .catch(function (error) {
        //console.log("error:", error);
      });
    setLoading(false);
  }

  const handleRegister = () => {
    history.push("/register");
  };

  const handleRecovery = () => {
    history.push("/recovery");
  };

  return (
    <div className={classes.container}>
      <video className={classes.videoTag} autoPlay loop muted>
        <source src={BackgroundVideo} type="video/mp4" />
      </video>

      {loading ? (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      ) : (
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Iniciar sesión
          </Typography>
          <TextField
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
            onChange={handlePassword}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Iniciar sesión
          </Button>

          <Grid container>
            <Grid item xs>
              <Link
                onClick={handleRecovery}
                variant="body2"
                style={{ cursor: "pointer" }}
              >
                ¿Se te olvidó tu contraseña?
              </Link>
            </Grid>
            <Grid item>
              <Link
                onClick={handleRegister}
                variant="body2"
                style={{ cursor: "pointer" }}
              >
                {"¿No tienes una cuenta? Regístrate"}
              </Link>
            </Grid>
          </Grid>
          <Box mt={8}>
            <Copyright />
          </Box>
        </div>
      )}
    </div>
  );
}
