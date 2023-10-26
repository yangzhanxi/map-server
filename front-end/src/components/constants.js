const HOST = '10.109.117.110'
const PORT = 58885
const URL = `http://${HOST}:${PORT}`
const IMPORT_EVENTS = `${URL}/import-map-events`
const UPLOAD_FILE = `${URL}/import-map`

module.exports = {
    IMPORT_EVENTS,
    UPLOAD_FILE
}