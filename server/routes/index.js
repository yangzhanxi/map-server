var express = require('express');
var router = express.Router();

const app_const = require('../app_const');

console.log(app_const.INDEX_HTML)
/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(app_const.INDEX_HTML);
});


module.exports = router;
