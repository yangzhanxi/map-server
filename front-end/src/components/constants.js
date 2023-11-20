const HOST = window.location.hostname
const PORT = 58885
const URL = `https://${HOST}:${PORT}`
const IMPORT_EVENTS = `${URL}/import-map-events`
const UPLOAD_FILE = `${URL}/import-map`

module.exports = {
    IMPORT_EVENTS,
    UPLOAD_FILE
}