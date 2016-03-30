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
      stringValue = stringValue.replace("AND", "\' ftand \'").replace("OR", "\' ftor \'").replace("NOT", "\' ftnot \'");
      console.log("String value block");
      console.log(stringValue);
      client.execute(tei + "for $v in .//TEI[. contains text "+stringValue+" using wildcards] return db:path($v)",
      function (error, result){
        if (error){
          console.log("ERRROR");
          console.error(error);}
        else {
         var searchResult = result.result.split('\n');
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
       res.render('searchResult', {title: 'Search Results', place: searchResult, value: queryValue})
      }
    }
  )
}
  else{
    res.render('search', {title: 'Search Database'})
  }
});

//tei + "(doc('Colenso/"+filePath+"'))",

router.get('/download', function(req, res, next){
  var path = req.query.document;
  console.log(path);
  console.log(tei + "(doc('Colenso"+path+"'))");
  client.execute(tei + "(doc('Colenso"+path+"'))"),
  function(error, result){
    if (error){
      console.log("ERROR");
      console.log(error);
    }
    else {
      console.log("found the document");
      var file = result.result;
      res.download("saved_files/",file);
    }
  }

})

router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Upload/Edit Database' });
});

module.exports = router;
