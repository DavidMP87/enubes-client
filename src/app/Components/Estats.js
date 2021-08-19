import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { config } from "../Config";
import axios from "axios";

export default function Estats() {
  const [labelsData, setLabelsData] = useState({});
  const [dataData, setDataData] = useState({});

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    const urlApi = config.endpoint + "enubes/get_data/";

    let labels = [];
    let data = [];

    var postData = new FormData();
    axios
      .post(urlApi, postData)
      .then(function (response) {
        if (response.status === 200) {
          response.data.posts.map((post) => {
            labels.push("Visitas post id " + post.id);
            data.push(post.visits);
          });
          labels.push("Total usuarios");
          data.push(response.data.users.length);
          labels.push("Total noticias");
          data.push(response.data.posts.length);

          //
          setLabelsData(labels);
          setDataData(data);
        }
      })
      .catch(function (error) {
        //console.log("error:", error);
      });
  }

  const data = {
    labels: labelsData,
    datasets: [
      {
        label: "# Estadisticas",
        data: dataData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <>
      <Doughnut data={data} style={{ height: 300 }} />
    </>
  );
}
