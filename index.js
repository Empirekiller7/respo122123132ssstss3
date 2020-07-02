var express = require("express");
var mustacheExpress = require('mustache-express'); 
const path = require("path");
var app = express();
const bodyParser = require("body-parser"); 

var server = app.listen(8095,function () {
var host = server.address().address === "::" ? "localhost" :
server.address().address

app.use(express.static(__dirname + "/public"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('mustache', mustacheExpress()); 
app.set('view engine', 'mustache'); //extensão dos ficheiros das views 
app.set('views', __dirname + '/Views');  //indicação de qual a pasta que irá conter as views

var Album = require(path.resolve(__dirname + "/Controllers", "Album-api.js"));
app.use("/api/Album", Album);
var Artist = require(path.resolve(__dirname + "/Controllers", "Artist-api.js"));
app.use("/api/Artist", Artist);
var Genre = require(path.resolve(__dirname + "/Controllers", "Genre-api.js"));
app.use("/api/Genre", Genre);
var Song = require(path.resolve(__dirname + "/Controllers", "Song-api.js"));
app.use("/api/Song", Song);
var Tag = require(path.resolve(__dirname + "/Controllers", "Tag-api.js"));
app.use("/api/Tag", Tag);

var backoffice =  require(path.resolve(__dirname + "/Controllers", "backoffice.js"));
app.use("/backoffice", backoffice);

var frontoffice =  require(path.resolve(__dirname + "/Controllers", "frontoffice.js"));
app.use("/frontoffice", frontoffice);

var port = server.address().port
console.log("Example app listening at http://%s:%s", host, port)
});

//routes
app.get("/", function (req, res) {
    res.send(__dirname + "/" + 'index.html');
});

