var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

app.listen(9909);

function handler(req, res) {
  fs.readFile(__dirname + '/index.html',
      function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  var currentUrl = '';
  var html = '';
  var $;
  socket.on('url', function(url, callback) {
    if (currentUrl !== url) {
      currentUrl = url;
      request.get(url, function(err, resp, body) {
        html = body;
        $ = cheerio.load(body);
        callback();
      });
    } else {
      callback();
    }
  });
  socket.on('code', function(code, callback) {
    var result;
    try {
      result = eval(code).toString();
    } catch(e) {
      result = e.message;
    }
    console.log(result);

    callback(result);
  });
});

