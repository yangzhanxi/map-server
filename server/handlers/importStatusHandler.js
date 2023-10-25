let isImporting = false;

async function getImportStatusHandler(req, res) {
    res.json({isImporting})
}

function getIsImporting() {
    return isImporting
}

function setIsImporting(flag) {
    isImporting = flag
}

module.exports = {
    getImportStatusHandler,
    getIsImporting,
    setIsImporting
}