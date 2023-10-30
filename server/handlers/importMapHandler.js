const { spawn } = require('child_process');

const app_const = require('../app_const');
const {sseSendMsg, sse} = require('./sseHandler')
const {getIsImporting, setIsImporting} = require('./importStatusHandler')

async function importMap(req, res) {
  let msg = 'Start to import map...'
  const eventName = 'import-map'
  sseSendMsg(eventName, msg)
  return new Promise((resolve, reject) => {
    // const script = spawn('bash', [app_const.IMPORT_MAP]);
    const script = spawn('sh', [app_const.SCRIPT_TEST]);

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

async function uploadMap(req, res) {
  let msg = '';
  const eventName = 'Upload Map'
  if (!req.files || Object.keys(req.files).length === 0) {
    msg = `No file was uploaded.`;
    sseSendMsg(eventName, msg)
    return res.status(400).send(msg);
  }

  const uploadFile = req.files.mapFile;
  msg = `Start to upload file ${uploadFile.name}.`;
  sseSendMsg(eventName, msg);

  msg = `File ${uploadFile.name} is uploading...`;
  sseSendMsg(eventName, msg);

  uploadFile.mv(app_const.MAP_DATA, function(err) {
    if (err) {
      msg = `File ${uploadFile.name} upload was failed.`
      sseSendMsg(eventName, msg)
      return res.status(500).send(err);
    }

    msg = `File ${uploadFile.name} was uploaded.`
    sseSendMsg(eventName, msg)
    res.status(200).send(msg)
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
  } catch(error) {
    sseSendMsg( constructMsgList('import-map', error))
  } finally {
    setIsImporting(false);
  }
}

module.exports = importMapHandler;