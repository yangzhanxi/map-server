const express = require('express');
const SSE = require('express-sse');
// const sseRouter = express.Router();

const sseExp = express();
const sse = new SSE();

sseExp.get('/', sse.init);

module.exports = {
  sse,
  sseExp
}
