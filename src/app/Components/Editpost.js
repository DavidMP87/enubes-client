import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState } from "draft-js";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { config } from "../Config";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "100ch",
      backgroundColor: "white",
    },
  },
  editor: {
    width: "100%",
  },
  editor1: {
    backgroundColor: "white",
  },
}));

export default function Addpost(props) {
  //const [postId, setPostId] = useState(null);
  const post_id = props.PostId;
  const classes = useStyles();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState("");
  const [selector, setSelector] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPost, setLoadingPost] = useState(true);
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
  }, []);

  useEffect(() => {
    setLoadingPost(true);
    getPost();
  }, []);

  function getPost() {
    const urlApi = config.endpoint + "enubes/get_posts_id/";

    var postData = new FormData();
    postData.append("id", props.PostId);
    axios
      .post(urlApi, postData)
      .then(function (response) {
        if (response.status === 200) {
          setTitle(response.data.post[0].title);
          setEditorState(
            EditorState.createWithContent(
              ContentState.createFromText(response.data.post[0].content)
            )
          );
          setSelector(response.data.post[0].state);
        }
        setLoadingPost(false);
      })
      .catch(function (error) {
        //console.log("error:", error);
      });
    setLoading(false);
  }

  const { vertical, horizontal, open } = stateSnack;

  function handleClickSnack(newState) {
    setStateSnack({ open: true, ...newState });
  }

  const handleCloseSnack = () => {
    setStateSnack({ ...stateSnack, open: false });
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const handleChangeSelector = (event) => {
    setSelector(event.target.value);
  };

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleSubmit = () => {
    editar();
  };

  async function editar() {
    const urlApi = config.endpoint + "enubes/update_post/";

    var postData = new FormData();
    postData.append("id", post_id);
    postData.append("user_id", user.id);
    postData.append("title", title);
    postData.append("content", editorState.getCurrentContent().getPlainText());
    postData.append("state", selector);
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
    <Container maxWidth="lg" className={classes.root}>
      {loadingPost ? (
        <div></div>
      ) : (
        <div>
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={handleCloseSnack}
            message="Noticia creada!!"
            key={vertical + horizontal}
          />
          <TextField
            required
            id="standard-required"
            label="Título"
            defaultValue=""
            onChange={handleTitle}
            value={title}
          />
          <Divider style={{ margin: 5 }} />
          <Editor
            editorState={editorState}
            wrapperClassName={{ backgroundColor: "white" }}
            editorClassName={{ backgroundColor: "white" }}
            editorStyle={{ backgroundColor: "white", minHeight: 200 }}
            onEditorStateChange={onEditorStateChange}
            value={"test"}
          />
          <Divider style={{ margin: 5 }} />
          <Select
            style={{ width: "100%" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selector}
            onChange={handleChangeSelector}
            disabled={user.r_change_state == 0 ? true : false}
          >
            <MenuItem value={1}>Pública</MenuItem>
            <MenuItem value={2}>Privada</MenuItem>
            <MenuItem value={3}>Publicada</MenuItem>
            <MenuItem value={4}>No publicada</MenuItem>
          </Select>
          <Divider style={{ margin: 5 }} />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Editar
          </Button>
        </div>
      )}
    </Container>
  );
}
