let express = require('express');
let app = express();
require('dotenv').config()
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(__dirname + "/public"));
app.use(function(req, res, next) {
    console.log(req.method + " " + req.path + " - " + req.ip);
    next();
});

app.get("/json", serveString);

path = __dirname + "/views/index.html";

function serveString(req, res) {
    res.json({
        "message": process.env.MESSAGE_STYLE === "uppercase" ? "HELLO JSON" : "Hello json"
    });
}

app.get("/now", function(req, res, next) {
    req.time = new Date().toString();
    next();
}, function(req, res) {
    res.json({
        "time": req.time
    });
}
);

app.get("/:word/echo", function(req, res) {
    res.json({
        "echo": req.params.word
    });
});

app.get("/name", function(req, res) {
    res.json({
        "name": `${req.query.first} ${req.query.last}`
    });
}
);

app.post("/name", function(req, res) {
    res.json({
        "name": `${req.body.first} ${req.body.last}`
    });
}
);




















 module.exports = app;
