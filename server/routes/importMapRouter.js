const express = require('express');

const {upload ,importMapHandler} = require('../handlers/importMapHandler');

const router = express.Router();

router.post('/', upload.single('mapFile'), importMapHandler)

module.exports = router