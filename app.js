var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var hsbot = require('./mtgbot');
var port = process.env.PORT || 3000;

//body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// test post route
app.post('/get_card', hsbot);

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function () {
  console.log('MTG Slack bot listening on port ' + port);
});
