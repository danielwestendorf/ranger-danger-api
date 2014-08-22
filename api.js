var fs = require("fs");
var path = require("path");
var express = require("express");

// Create app and load ranger pix
var app = express.createServer();

// Process the photos, every time they change.
var start = +new Date;
var files = fs.readdirSync("./ranger").filter(function(path) {
  return path.charAt(0) !== ".";
})

app.set('port', process.env.PORT || 3333);

app.get("/", function(req, res) {
  res.send({
    "/random": { src: "some_file.jpg" },
    "/all": [{ src: "some_file.jpg" }],
    "/src/:path": "<%file_stream%>"
  });
});

// When hit, randomly send back an image url
app.get("/random", function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.send(files[Math.floor(Math.random()*files.length)]);
});

// When hit, send back all images
app.get("/all", function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.send({
    meta: {
      total: files.length
    },

    files: files
  });
});

// Get a specific ranger url image
app.get("/src/:path", function(req, res) {
  fs.createReadStream(path.resolve("./ranger", req.params.path)).pipe(res);
});

// Listen on port 3333
app.listen(app.get('port'));
console.log("Starting Ranger Danger API on http://localhost:" + app.get('port'));

// Don't bail out, but log out the error
process.on("uncaughtException", function(err) {
  console.error(err);
});
