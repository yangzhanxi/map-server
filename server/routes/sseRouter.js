const express = require('express');

const {sse} = require('../handlers/sseHandler');

const router = express.Router();

router.get('/', sse.init);

module.exports = router