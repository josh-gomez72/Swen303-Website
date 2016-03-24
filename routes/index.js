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

router.get('/browse', function(req, res, next) {
	client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" + "(//name[@type='place'])[1] ",
	function (error, result) {
		if (error){ console.error(error);}
		else {
		  res.render('browse', { title: 'Browse Database', place: result.result});
		}
	}		
	)
});

router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Upload/Edit Database' });
});


module.exports = router;
