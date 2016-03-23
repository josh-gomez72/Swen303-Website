var express = require('express');
var router = express.Router();
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('browse', { title: 'Colenso Project' });
});


client.execute("OPEN Colenso");

module.exports = router;
 
