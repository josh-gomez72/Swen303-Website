var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

client.execute("OPEN Colenso");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Colenso Project' });
});

router.get('/search', function(req, res, next) {
  res.render('search', { title: 'Search Database' });
});

router.get('/documentView', function(req, res, next) {
	client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" + "(doc('Colenso/"+req.query.document+"'))[1] ",
	function (error, result) {
		if (error){ console.error(error);}
		else {
		  res.render('documentView', { title: "Document View", document: result.result});
		}
	}
	)
});

router.get('/browse', function (req, res, next){
	client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +"db:list('Colenso')",
	function (error, result) {
		if (error){ console.error(error);}
		else {
		  var documentList = result.result.split('\n');
		  res.render('browse', { title: 'List of Database', place: documentList});
		}
	}
	)
});

router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Upload/Edit Database' });
});


module.exports = router;
