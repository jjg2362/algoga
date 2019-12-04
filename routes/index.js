var express = require('express');
var router = express.Router();
var session = require('express-session');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: "yunudb.c9jcx2tgvrrn.us-west-2.rds.amazonaws.com",
  user: 'admin',
  password: 'kimchiman5368',
  database: 'mydb',
  port: '3306'
})

/* GET home page. */
router.get('/', function (req, res, next) {
  sess = req.session;
  res.render('index', {
    title: 'Algoga',
    login: sess.login,
    id: sess.id,
    loginid: sess.loginid,
    num: sess.num
  });
});

router.post('/allalgor', function (req, res, next) {
  var queryString = 'SELECT * FROM tbl_algor ORDER BY type';
  connection.query(queryString, function (err, results) {
    if (err) {
      res.send({ results: -1 });
    }
    else{
      res.send({ results: results });
    }
  })
});


module.exports = router;
