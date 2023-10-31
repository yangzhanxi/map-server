const { spawn } = require('child_process');
const multer = require('multer')

const app_const = require('../app_const');
const {sseSendMsg} = require('./sseHandler')
const {getIsImporting, setIsImporting} = require('./importStatusHandler')

async function importMap() {
  let msg = 'Start to import map...'
  const eventName = 'import-map'
  sseSendMsg(eventName, msg)
  return new Promise((resolve, reject) => {
    const script = spawn('bash', [app_const.IMPORT_MAP]);
    // const script = spawn('sh', [app_const.SCRIPT_TEST]);

    script.stdout.on('data', (data) => {
      msg = data.toString();
      sseSendMsg(eventName, msg)
      sseSendMsg(eventName, msg)
    });

    script.stderr.on('data', (data) => {
      msg = `${data.toString()}`;
      sseSendMsg(eventName, msg)
    });

    script.on('error', (error) => {
      msg = `error: ${error}`;
      sseSendMsg(eventName, msg)
      reject(error);
    });

    script.on('close', (code) => {
      setIsImporting(false)
      if (code === 0) {
        msg = 'Map was imported.'
        sseSendMsg(eventName, msg);
      } else {
        msg = 'Failed to import map.'
        sseSendMsg(eventName, msg);
      }
    });
  });
}

async function uploadMapMulter(req, res) {
  let msg = '';
  const eventName = 'upload-map'
  if (!req.file || Object.keys(req.file).length === 0) {
    msg = `No file uploaded.`;
    sseSendMsg(eventName, msg)
    return res.status(400).json({
      error: msg});
  }

  const { originalname, filename, size } = req.file;
  msg = 'File was uploaded successfully'
  sseSendMsg(eventName, msg)
  return res.status(200).json({
    message: msg,
    fileInfo: {
      originalname,
      filename,
      size,
    },
  });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/root/src/map-server/map-data')
  },
  filename: function (req, file, cb) {
    cb(null, 'map.osm.pbf')
  }
})

const upload = multer({storage: storage})

async function importMapHandler(req, res) {
  if (getIsImporting()) {
    return res.status(400).send('Can not import map, the server is importing data.')
  }
  setIsImporting(true);

  try{
    await uploadMapMulter(req, res)
    await importMap(req, res);
  } catch(error) {
    sseSendMsg('import-map', error)
  } finally {
    setIsImporting(false);
  }
}

module.exports = {upload, importMapHandler};