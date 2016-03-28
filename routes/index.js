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
  console.log(req.query.document)
	client.execute(tei + "(doc('Colenso/"+req.query.document+"'))",
	function (error, result) {
		if (error){ console.error(error);}
		else {
		  res.render('documentView', { title: "Document View", document: result.result});
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
    var query = req.query.query;
    console.log(req.req);
    console.log(query);
});



router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Upload/Edit Database' });
});

module.exports = router;
