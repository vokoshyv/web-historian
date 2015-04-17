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


var getFile = function(filePath , callback) {
  fs.readFile(filePath, 'utf-8', function (err,data) {
    if (err) {
      console.log(err);
    }
    else {
      callback(data);
    }
  });
}

var storage = [];

exports.handleRequest = function (req, res) {

  var specialURL;
// -----------------------------------
  var indexStart = req.url.split('=')[0].length + 1;
  var pertinentData = req.url.slice(indexStart);
  console.log('pertinentData:', pertinentData);



  // if (storage.indexOf(pertinentData)>-1){
  // }
  // // else {
  //   console.log('ENTERED HERE');
  //   getFile('web/public/loading.html', function(data){
  //     console.log('Made it here');
  //     res.writeHead(302, headers)
  //     res.end(data);
  //     console.log('DATA', data);
  //     // res.end('MadeIt');
  //   });
  // }


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
      archive.grabSite(pertinentData, res);
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
        console.log('Made it here');
        res.writeHead(302, headers)
        res.end(data);
        console.log('DATA', data);
        // res.end('MadeIt');
      });


      getFile('archives/sites/' + pertinentData + '.html', function(data){
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
        fs.readFile(archive.paths.list, 'utf-8', function (err,data) {
          if (err) {
            console.log(err);
          }
          else {

            if (data.indexOf(pertinentData)>-1) {
              getFile('archives/sites/' + pertinentData + '.html', function(data){
                res.writeHead(200, headers)
                res.end(data);
              }, function(){console.log(err);});
              //then we will getFile of the webpage inside archives/sites
            }
            else {
              console.log("going inside here on not recorded site")
              // res.writeHead(302, {'Location': 'http://127.0.0.1:8080/loading.html'});
              // res.end();

              archive.addSiteNameToFile(pertinentData + "\n");
              archive.grabSite(pertinentData, res);

              //direct user to loading page
              // getFile('web/public/loading.html', function(data){
              //   res.writeHead(200, headers);
              //   res.end(data);
              // });
            }

          }
        });

        // getFile(archive.paths.list, function(data){
        //   if (data.indexOf(pertinentData)>-1) {
        //     getFile('archives/sites' + pertinentData + '.html', function(data){
        //       res.writeHead(200, headers)
        //       res.end(data);
        //     });
        //     //then we will getFile of the webpage inside archives/sites
        //   }
        //   else {
        //     //direct user to loading page
        //     getFile('web/public/loading.html', function(data){
        //       res.writeHead(200, headers)
        //       res.end(data);
        //     });
        //   }
        // }, function(){ // error callback; nothing in path location
        //   console.log('ERR', err);
        //   res.writeHead(404, headers);
        //   res.end();

        // });





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
    // setTimeout(function() {
    //   console.log('Im READY!!!',data);
    // }, 1000);


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

