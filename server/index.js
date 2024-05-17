const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const app = express();

const PORT = process.env.PORT || 3000;
const indexPath = path.resolve(__dirname, "..", "build", "index.html");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  express.static(path.resolve(__dirname, "..", "build"), { maxAge: "30d" })
);

app.get("/*", (req, res, next) => {
  console.log("get data------");
  fs.readFile(indexPath, "utf8", (err, htmlData) => {
    if (err) {
      console.error("Error during file reading", err);
      return res.status(404).end();
    }

    const postData = req.body;
    console.log("postData-------", postData);
    htmlData = htmlData
      // .replace("<title>Aqrableek</title>", `<title>${postData.title}</title>`)
      // .replace("__META_OG_TITLE__", postData.title)
      .replace("__META_OG_DESCRIPTION__", postData.description)
      .replace("__META_DESCRIPTION__", postData.description)
      .replace("__META_OG_IMAGE__", postData?.user?.profilePic);

    console.log("htmlData", htmlData);
    return res.send(htmlData);
  });
});

app.post("/post/:id", (req, res) => {
  const postData = req.body;
  console.log("Received post data:", postData);

  res.send("Post data received successfully");
});

app.listen(PORT, (error) => {
  if (error) {
    return console.log("Error during app startup", error);
  }
  console.log("listening on " + PORT + "...");
});
