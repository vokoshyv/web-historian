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

  var specialURL;
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
      //data = '';
    }
    else {
      data = '';
    }

  });
// -----------------------------------


  if (req.method === 'GET') {
    if (req.url === '/') {
      getFile('web/public/index.html', function(data){
        res.writeHead(200, headers)
        res.end(data);
      });

    }
    else if (req.url === '/loading.html'){
      getFile('web/public/loading.html', function(data){
        res.writeHead(200, headers)
        res.end(data);
      });

    }
    else {
      console.log('***SUPERLOG***:', req.method, req.url);

      if (req.url.split('=')[0] === '/?url') {
        var indexStart = req.url.split('=')[0].length + 1;
        var pertinentData = req.url.slice(indexStart);
        console.log(pertinentData);

        // regexp of pertinentData within sites.txt
        if () {
          //then we will getFile of the webpage inside archives/sites
        }
        else {
          //direct user to loading page
          getFile('web/public/loading.html', function(data){
            res.writeHead(200, headers)
            res.end(data);
          });
        }

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

  }
  else if (req.method === 'POST' && req.url === '/') {


    // Conditional async testing, akin to Jasmine's waitsFor()
    setTimeout(function() {
      console.log('Im READY!!!',data);
    }, 1000);


    // req.on('data', function(chunk) {
    //   if (req.method === 'POST' && req.url === '/') {
    //     data += chunk;
    //   }
    // });
    // console.log(data);




    res.writeHead(302, {'Location': 'http://127.0.0.1:8080/loading.html'});
    res.end();
  }
  else {
    res.writeHead(404, headers);
    res.end();
    //TODO: else cases
  }



};

