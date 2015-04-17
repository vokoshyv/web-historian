var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  callback(["example1.com", "example2.com"]);
};

exports.isUrlInList = function(){
};

exports.addUrlToList = function(){
};

exports.isURLArchived = function(){
};

exports.downloadUrls = function(){
};

exports.grabSite = function(site) {

  // loosely based on:
  // http://stackoverflow.com/questions/5294470/node-js-writing-image-to-local-server

  var options = {
      host: site
    , port: 80
    , path: '/'
  }

  http.get(options, function(res){
      var data = ''
      res.setEncoding('binary')

      res.on('data', function(chunk){
          data += chunk
      })

      res.on('end', function(){
          fs.writeFile("archives/sites" + '/' + site + '.html', data, 'binary', function(err){
              if (err) throw err
          })
      })

  })

};

exports.addSiteNameToFile = function(siteName) {
  fs.appendFile(this.paths.list, siteName, function (err) {
    if (err) throw err;
  });
};
