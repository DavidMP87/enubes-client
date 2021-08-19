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

export default function Recovery() {
  const classes = useStyles();
  let history = useHistory();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");

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

  const handleSubmit = () => {
    let isError = false;
    if (validator.isEmpty(email) || !validator.isEmail(email)) {
      setEmailError(true);
      setEmailErrorMsg("Por favor introduce un email valido.");
      isError = true;
    }

    if (!isError) {
      recovery();
    }
  };

  async function recovery() {
    const urlApi = config.endpoint + "enubes/get_user_recovery/";

    var postData = new FormData();
    postData.append("email", email);
    axios
      .post(urlApi, postData)
      .then(function (response) {
        if (response.status === 200) {
          if (response.data.user === 0) {
            setEmailError(true);
            setEmailErrorMsg("El email no existe");
          } else {
            history.push("/");
          }
        }
      })
      .catch(function (error) {
        console.log("error:", error);
      });
  }

  const handleRegister = () => {
    history.push("/register");
  };

  const handleLogin = () => {
    history.push("/");
  };

  return (
    <div className={classes.container}>
      <video className={classes.videoTag} autoPlay loop muted>
        <source src={BackgroundVideo} type="video/mp4" />
      </video>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Recuperar Contraseña
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

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleSubmit}
        >
          Recuperar
        </Button>
        <Grid container>
          <Grid item xs>
            <Link onClick={handleLogin} variant="body2">
              {"Iniciar sesión"}
            </Link>
          </Grid>
          <Grid item>
            <Link onClick={handleRegister} variant="body2">
              {"¿No tienes una cuenta? Regístrate"}
            </Link>
          </Grid>
        </Grid>
        <Box mt={8}>
          <Copyright />
        </Box>
      </div>
    </div>
  );
}
