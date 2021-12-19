const express = require("express");
const responseTime = require("response-time");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({ extended: true })
); /* bodyParser.urlencoded() is deprecated */

const db = require("./app/models/index");

//db.sequelize.sync();
// drop the table if it already exists
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});

app.use(express.static(__dirname + "/../data/"));

app.use(
  responseTime((req, res, time) => {
    console.log(`${req.method} ${req.url} ${time}`);
  })
);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Semomun API." });
});

require("./app/routes/workbooks")(app);
require("./app/routes/sections")(app);
require("./app/routes/upload")(app);
require("./app/routes/auth")(app);
require("./app/routes/login")(app);

/*
const fs = require('fs');
const sharp = require('sharp');

var src = 256;
var dest = 128;
//sharp(imagePath).resize({width:65}).toFile("sharp_resize1.jpg");
const dir = './public/images/workbook/';
var srcdir = dir + src + 'x' + src + '/';
var destdir = dir + dest + 'x' + dest + '/';
fs.readdir(srcdir, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(file => {
        console.log(srcdir + file);
        sharp(srcdir + file).resize({width:dest}).toFile(destdir + file);
    });
    
});
*/

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
