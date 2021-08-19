import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FavoriteIcon from "@material-ui/icons/Favorite";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { config } from "../Config";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import EditIcon from "@material-ui/icons/Edit";
import { useHistory } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function Posts() {
  const classes = useStyles();
  const [spacing, setSpacing] = useState(3);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  let history = useHistory();
  const [stateSnack, setStateSnack] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });

  useEffect(() => {
    setLoading(true);
    const userd = JSON.parse(localStorage.getItem("user"));
    setUser(userd);
    setLoading(false);
  }, [posts]);

  useEffect(() => {
    setLoadingPosts(true);
    getPosts();
  }, []);

  function getPosts() {
    const urlApi = config.endpoint + "enubes/get_posts/";

    var postData = new FormData();
    axios
      .post(urlApi, postData)
      .then(function (response) {
        if (response.status === 200) {
          setPosts(response.data.posts);
          setLoadingPosts(false);
        }
      })
      .catch(function (error) {
        //console.log("error:", error);
      });
  }

  const { vertical, horizontal, open } = stateSnack;

  function handleClickSnack(newState) {
    setStateSnack({ open: true, ...newState });
  }

  const handleCloseSnack = () => {
    setStateSnack({ ...stateSnack, open: false });
  };

  function deletePost(post_id) {
    const urlApi = config.endpoint + "enubes/delete_posts/";

    var postData = new FormData();
    postData.append("id", post_id);
    axios
      .post(urlApi, postData)
      .then(function (response) {
        if (response.status === 200) {
          handleClickSnack({ vertical: "top", horizontal: "right" });
        }
      })
      .catch(function (error) {
        //console.log("error:", error);
      });
  }

  return (
    <Grid container className={classes.root} spacing={2}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleCloseSnack}
        message="Noticia eliminada!!"
        key={vertical + horizontal}
      />
      {loadingPosts ? (
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={spacing}>
            <CircularProgress />
          </Grid>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={spacing}>
            {posts.map((value) => (
              <Grid key={value.id + 200} item>
                <Paper className={classes.paper}>
                  <Card key={value.id} className={classes.rootCard}>
                    <CardHeader
                      avatar={
                        <Avatar aria-label="recipe" className={classes.avatar}>
                          R
                        </Avatar>
                      }
                      action={
                        <IconButton aria-label="settings">
                          <MoreVertIcon />
                        </IconButton>
                      }
                      title={value.title}
                      subheader={value.created_at}
                    />

                    <CardContent>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {value.content}
                      </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                      {user.r_update == 1 && (
                        <IconButton
                          aria-label="Editar noticia"
                          onClick={() => {
                            history.push({
                              pathname: "/home",
                              state: { post_id: value.id },
                            });
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      {user.r_delete == 1 && (
                        <IconButton
                          aria-label="Eliminar noticia"
                          onClick={() => {
                            deletePost(value.id);
                          }}
                        >
                          <DeleteForeverIcon />
                        </IconButton>
                      )}
                    </CardActions>
                  </Card>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
