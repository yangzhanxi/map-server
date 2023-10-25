const express = require('express');

const {getImportStatusHandler} = require('../handlers/importStatusHandler');

const router = express.Router();
router.get('/', getImportStatusHandler)

module.exports = router