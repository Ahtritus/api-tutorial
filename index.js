const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const PORT = process.env.PORT || 2000;

const app = express();
app.listen(PORT, () => {
  console.log("Server started");
});

const newspapers = [
  {
    source: "Times Of India",
    address: "https://timesofindia.indiatimes.com/sports/cricket",
    base: "https://timesofindia.indiatimes.com",
  },
  {
    source: "Cricbuzz ",
    address:
      "https://www.cricbuzz.com/?utm_source=TOInewHP_TILwidget&utm_medium=ABtest&utm_campaign=TOInewHP",
    base: "https://www.cricbuzz.com/?utm_source=TOInewHP_TILwidget&utm_medium=ABtest&utm_campaign=TOInewHP",
  },
  {
    source: "Hindustan Times",
    address: "https://www.hindustantimes.com/cricket",
    base: "https://www.hindustantimes.com/",
  },
  {
    source: "The Telegraph",
    address: "https://www.telegraphindia.com/sports/cricket",
    base: "https://www.telegraphindia.com/",
  },
  {
    source: "The Statesman",
    address: "https://www.thestatesman.com/sports",
    base: "https://www.thestatesman.com/",
  },
  {
    source: "Deccan Herald",
    address: "https://www.deccanherald.com/sports",
    base: "https://www.deccanherald.com/",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios
    .get(newspaper.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("India")', html).each(function () {
        var title = $(this).text();
        let url = $(this).attr("href");

        if (!url.startsWith("https://")) {
          url = newspaper.base + url;
        }

        const obj = {
          origin: newspaper.source,
          title,
          url,
        };
        articles.push(obj);
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/", (req, res) => {
  console.log("Server started!");
  console.log(req);
  res.send("Welcome to my Server for cricket news!");
});

app.get("/test/:password", (req, res) => {
  let pass = req.params.password;
  if (pass == "poushShonkranti") res.json(articles);
  res.status(503);
});
