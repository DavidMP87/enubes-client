import React from "react";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import BackgroundVideo from "../Videos/video_corporativo.mp4";
import { useHistory } from "react-router-dom";

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

  const handleLogin = () => {
    history.push("/");
  };

  return (
    <div className={classes.container}>
      <video className={classes.videoTag} autoPlay loop muted>
        <source src={BackgroundVideo} type="video/mp4" />
      </video>

      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Cuenta creada!!
        </Typography>
        <br></br>
        <Typography>
          La cuenta a sido creada con exito, se a enviado un correo electrónico
          a el correo indicado.
        </Typography>
        <br></br>
        <Typography>
          <b>Por favor confirma la cuenta para poder iniciar sessión.</b>
        </Typography>
        <br></br>
        <Grid container>
          <Grid item>
            <Link
              onClick={handleLogin}
              variant="body2"
              style={{ cursor: "pointer" }}
            >
              {"Iniciar sesión"}
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
