var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

var tei = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';"

client.execute("OPEN Colenso");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Colenso Project' });
});

router.get('/search', function(req, res, next) {
  res.render('search', { title: 'Search Database' });
});

router.get('/documentView', function(req, res, next) {
  console.log(req.query);
  var filePath = req.query.document;
  console.log(filePath);
	client.execute(tei + "(doc('Colenso/"+filePath+"'))",
	function (error, result) {
		if (error){ console.error(error);}
		else {
		  res.render('documentView', { title: "Document View", document: result.result, path: filePath});
		}
	}
	)
});

router.get('/download', function(req, res, next){
  console.log("Downloading " + req.query.document);
  res.render('index', {title: 'Colenso Project'});
});

router.get('/browse', function (req, res, next){
	client.execute(tei +"db:list('Colenso')",
	function (error, result) {
		if (error){ console.error(error);}
		else {
		  var documentList = result.result.split('\n');
		  res.render('browse', { title: 'List of Database', place: documentList});
		}
	}
)
});

router.get('/searchResult', function(req, res, next){
    var stringValue = req.query.stringValue;
    var queryValue = req.query.queryValue;
    if (stringValue){
      stringValue = "'"+ (req.query.stringValue)+ "'";
      console.log("String value block");
      console.log(stringValue);
      client.execute(tei + "for $v in .//TEI[. contains text "+stringValue+"] return db:path($v)",
      function (error, result){
        if (error){
          console.log("ERRROR");
          console.error(error);}
        else {
         var searchResult = result.result.split('\n');
         console.log(searchResult);
         res.render('searchResult', {title: 'Search Results', place: searchResult, value: stringValue})
        }
      }
    )
  }
  else if (queryValue){
    console.log("Query Value Block");
    console.log(queryValue);
    client.execute(tei + "for $v in " +queryValue+" return db:path($v)",
    function (error, result){
      if (error){
        console.log("ERRROR");
        console.error(error);}
      else {
       var searchResult = result.result.split('\n');
       console.log(searchResult);
       res.render('searchResult', {title: 'Search Results', place: searchResult, value: queryValue})
      }
    }
  )
}
  else{
    res.render('searchResult', {title: 'Search Results', place: [], value: stringValue})
  }
});

router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Upload/Edit Database' });
});

module.exports = router;
