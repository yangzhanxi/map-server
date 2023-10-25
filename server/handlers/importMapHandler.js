const { spawn } = require('child_process');

const app_const = require('../app_const');
const {sseSendMeg} = require('./sseHandler')
const {getIsImporting, setIsImporting} = require('./importStatusHandler')

const constructData = (msg) => {
  const data = {
    message: msg,
    isImporting: getIsImporting()
  }
  return JSON.stringify(data)
}

async function importMap(req, res) {
  let msg = 'Start to import map...'
  sseSendMeg('import-map', constructData(msg))
  return new Promise((resolve, reject) => {
    // const script = spawn('sh', [app_const.IMPORT_MAP]);
    const script = spawn('sh', [app_const.SCRIPT_TEST]);

    script.stdout.on('data', (data) => {
      msg = data.toString();
      sseSendMeg('import-map', constructData(msg))
    });

    script.stderr.on('data', (data) => {
      msg = `error: ${data.toString()}`;
      sseSendMeg('import-map', constructData(msg))
    });

    script.stderr.on('error', (error) => {
      msg = `error: ${error}`;
      sseSendMeg('import-map', constructData(msg))

      reject(error);
    });

    script.on('close', (code) => {
      if (code === 0) {
        msg = 'Map was imported.'
        sseSendMeg('import-map', constructData(msg))
        resolve();
      } else {
        msg = 'Failed to import map.'
        sseSendMeg('import-map', constructData(msg))
        res.status(500).send(msg);
        reject(new Error(`Failed to import map ${code}`));
      }
    });
  });
}

async function uploadMap(req, res) {
  let msg = '';
  if (!req.files || Object.keys(req.files).length === 0) {
    msg = `No file was uploaded.`;
    sseSendMeg('upload-map', constructData(msg))
    return res.status(400).send(msg);
  }
  const uploadFile = req.files.mapFile;
  msg = `Upload file ${uploadFile.name}.`;
  sseSendMeg('upload-map', constructData(msg))
  console.log(app_const.MAP_DATA)
  uploadFile.mv(app_const.MAP_DATA, function(err) {
    if (err) {
      msg = `File ${uploadFile.name} upload was failed.`
      console.log(err)
      sseSendMeg('upload-map', constructData(msg))
      return res.status(500).send(err);
    }
    msg = `File ${uploadFile.name} was uploaded.`
    console.log(msg)
    sseSendMeg('upload-map', constructData(msg))
  });
}

async function importMapHandler(req, res) {
  if (getIsImporting()) {
    return res.status(400).send('Can not import map, the server is importing data.')
  }

  setIsImporting(true);

  try{
    await uploadMap(req, res);
    await importMap(req, res);
    res.status(200).send('pass.')
  } catch(error) {
    res.status(500).send(error);
  } finally {
    setIsImporting(false);
  }
}

module.exports = importMapHandler;