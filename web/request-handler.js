var fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');

// var hr = require('node_modules/http-request');
// // require more modules/folders here!


// hr.get('google.com', "archives/sites/GOOGLETEST",function (err, res) {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   console.log("GOOOOOOOOGLE", res.code, res.headers, res.file);
// });


// var storage = []
// -----------------------------------
var data = '', chunk = '';
// -----------------------------------

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "text/html"
};


var getFile = function(filePath , callback, errcb) {
  fs.readFile(filePath, 'utf-8', function (err,data) {
    if (err) {
      errcb();
    }
    else {
      callback(data);
    }
  });
}

exports.handleRequest = function (req, res) {

// -----------------------------------
  req.on('data', function(chunk) {
    if (req.method === 'POST' && req.url === '/') {
      data += chunk;
    }
  });


  req.on('end', function() {
    if (req.method === 'POST' && req.url === '/') {
      var indexStart = data.split('=')[0].length + 1;
      var pertinentData = data.slice(indexStart);
      archive.addSiteNameToFile(pertinentData + "\n");
      archive.grabSite(pertinentData);
    }
    data = '';
  });
// -----------------------------------



  if (req.method === 'GET') {
    if (req.url === '/') {
      getFile('web/public/index.html', function(data){
        res.writeHead(200, headers)
        res.end(data);
      });

    }
    else {
      getFile('archives/sites' + req.url, function(data){
        res.writeHead(200, headers);
        res.end(req.url);
      }, function(){ // error callback; nothing in path location
        res.writeHead(404, headers);
        res.end();
      });

    }

  }

  else if (req.method === 'POST' && req.url === '/') {
    res.writeHead(302, headers)
    res.end();
    //console.log('POST condition ...', req.method);
  }

  else {
    res.writeHead(404, headers);
    res.end();
    // console.log('reached the else option');
    //console.log('ELSE in request-handler', req.method);
    //TODO: else cases
  }



};

