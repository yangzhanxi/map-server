const path = require('path');

const BASE_PATH = path.join(__dirname, '..');;

const FRONT_END_PATH = path.join(BASE_PATH, 'front-end');
const FRONT_BUILD = path.join(FRONT_END_PATH, 'build');
const INDEX_HTML = path.join(FRONT_BUILD, 'index.html');
const SCRIPTS = path.join(BASE_PATH, 'scripts');
const IMPORT_MAP = path.join(SCRIPTS, 'import_map.sh');
const SCRIPT_TEST = path.join(SCRIPTS, 'script_test.sh');
const MAP_DATA_PATH = path.join(BASE_PATH, 'map-data')
const MAP_FILE = 'map.osm.pbf'
const MAP_DATA = path.join(MAP_DATA_PATH, MAP_FILE);
const PORT = 58885

const app_const = {
    FRONT_END_PATH,
    FRONT_BUILD,
    INDEX_HTML,
    SCRIPTS,
    IMPORT_MAP,
    MAP_DATA,
    PORT,
    SCRIPT_TEST,
    MAP_FILE,
    MAP_DATA_PATH
}

console.log(app_const);
module.exports = app_const;