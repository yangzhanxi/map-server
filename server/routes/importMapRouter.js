const express = require('express');

const importMapHandler = require('../handlers/importMapHandler');

const router = express.Router();

router.post('/', importMapHandler)

module.exports = router