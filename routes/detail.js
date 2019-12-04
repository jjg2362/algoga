var express = require('express');
var router = express.Router();
var session = require('express-session');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "yunudb.c9jcx2tgvrrn.us-west-2.rds.amazonaws.com",
    user: 'admin',
    password: 'kimchiman5368',
    database: 'mydb',
    port: '3306',
    multipleStatements: true
})

/* GET detail page. */
router.get('/', function (req, res, next) {
  sess = req.session;
  var sql1 = "SELECT * from tbl_algor where num =?;";
  var sql2 = "SELECT * FROM tbl_pro WHERE algor_num=?;"
  var sql3 = "SELECT * FROM tbl_que WHERE algor_num=?;";
  var sql4 = "select tbl_pro.num, count(case when tbl_pro.num = tbl_que.pro_num then 0 end) as count from tbl_pro, tbl_que where tbl_pro.algor_num = ? group by tbl_pro.num;"
  connection.query(
    sql1 + sql2 + sql3 + sql4, [req.query.id, req.query.id, req.query.id, req.query.id], function (err, results) {
    if (err) {
      console.log('error')
      res.redirect('../');
    } else {
      var sql1_result = results[0][0];
      var sql2_result = results[1];
      var sql3_result = results[2];
      var sql4_result = results[3];

      res.render('detail', {
        title:'Algoga Detail',
        algor:sql1_result,
        pro:sql2_result,
        que:sql3_result,
        que_count:sql4_result,
        login : sess.login,
        id : sess.id,
        loginid: sess.loginid,
        num : sess.num
      });
    }
  })
});

router.post('/algorqueview', function (req, res, next) {
  var option = req.body.params;
  var queryString = 'SELECT * FROM tbl_que WHERE algor_num=\"' + option.algor + '\" AND pro_num=\"' + option.pronum + '\"';
  connection.query(queryString, function (err, results) {
    if (err) {
      res.send({ results: -1 });
    }
    else{
      res.send({ results: results });
    }
  })
});

router.post('/algorqueadd', function (req, res, next) {
  var option = req.body.params;
  var queryString = 'INSERT INTO tbl_que (algor_num, pro_num, title, date) VALUES (\"' + option.algor + '\",\"' + option.pronum + '\",\"' + option.title + '\", NOW())';
  connection.query(queryString, function (err, results) {
    if (err) {
      res.send({ results: -1 });
    }
    else{
    }
  })
});

router.post('/algoransview', function (req, res, next) {
  var option = req.body.params;
  var queryString = 'SELECT * FROM tbl_ans WHERE algor_num=\"' + option.algor + '\" AND pro_num=\"' + option.pronum + '\" AND que_num=\"' + option.quenum + '\"';
  connection.query(queryString, function (err, results) {
    if (err) {
      res.send({ results: -1 });
    }
    else{
      res.send({ results: results });
    }
  })
});

router.post('/algoransadd', function (req, res, next) {
  var option = req.body.params;
  var queryString = 'INSERT INTO tbl_ans (algor_num, pro_num, que_num, answer, date) VALUES (\"' + option.algor + '\",\"' + option.pronum + '\",\"' + option.quenum + '\",\"' + option.answer + '\", NOW())';
  connection.query(queryString, function (err, results) {
    if (err) {
      res.send({ results: -1 });
    }
    else{
    }
  })
});

router.post('/star', function(req, res, next) {
  var option = req.body.params;
  var queryString = 'UPDATE tbl_pro SET person=person+1, star=star + \"' + option.star + '\" WHERE algor_num=\"' + option.algor + '\" AND num=\"' + option.num + '\"';
  connection.query(queryString, function (err, results) {
    if (err) {
      res.send({ results: -1 });
    }
    else{
    }
  })
});

router.post('/login', function(req, res, next) {
  var option = req.body.params;
  var queryString = 'SELECT * from user where id=\"' + option.id + '\" and password=\"' + option.password + '\"';
  connection.query(queryString, function (err, results) {
    if (err) {
    }
    else if (results.length > 0) {  // 로그인 됬을때
      sess = req.session;
      sess.login=true;
      sess.loginid=results[0].id;
      sess.num=results[0].num;
      var string="로그인 되었습니다."
      res.send({ string });
    }
    else{ // 안됬을 때
      var string="로그인 정보가 일치하지 않습니다."
      res.send({ string });
    }
  })
});

router.post('/logout', function (req, res, next) {
  sess = req.session;
  req.session.destroy(function(err)
  {
      if(err){
        qalert('로그아웃 되었습니다.');
      }else{
          res.redirect('/');
      }
  })
});


router.post('/signup', function(req, res, next) {
  var option = req.body.params;
  var queryString = 'insert into user (id, password) values (\"' + option.id + '\", \"' + option.password + '\")';
  connection.query(queryString, function (err, results) {
    if (err) {  // 회원가입 안 됬을때
      var string="이미 가입된 id가 존재합니다.";
      res.send({ string });
    }
    else{ // 회원가입 됬을 때
      var string="회원가입 되었습니다."
      res.send({ string });
    }
  })
});

module.exports = router;
