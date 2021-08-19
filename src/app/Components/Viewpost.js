import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { config } from "../Config";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";

export default function Viewpost(props) {
  const [stateSnack, setStateSnack] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });

  let state = "";
  switch (props.post.state) {
    case "1":
      state = "Pública";
      break;
    case 2:
      state = "Privada";
      break;
    case 3:
      state = "Publicada";
      break;
    case 4:
      state = "No publicada";
      break;
  }
  useEffect(() => {
    updateVisit();
  }, []);

  function updateVisit() {
    const urlApi = config.endpoint + "enubes/increment_visit/";

    var postData = new FormData();
    postData.append("id", props.post.id);
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

  const { vertical, horizontal, open } = stateSnack;

  function handleClickSnack(newState) {
    setStateSnack({ open: true, ...newState });
  }

  const handleCloseSnack = () => {
    setStateSnack({ ...stateSnack, open: false });
  };

  return (
    <div>
      <React.Fragment>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleCloseSnack}
          message="Visita incrementada."
          key={vertical + horizontal}
        />
        <Container maxWidth="lg">
          <h1>{props.post.title}</h1>
          <div style={{ border: "1px black solid", minHeight: 500 }}>
            {props.post.content}
          </div>
          <p>{state}</p>
        </Container>
      </React.Fragment>
    </div>
  );
}
