const { spawn } = require('child_process');

const app_const = require('../app_const');
const {sse} = require('./sseRouter');

let isImporting = false

// const createEventMsg = (msg) => {
//   const log = {
//     message: msg,
//     isLoading: isImporting
//   }

//   return SON.stringify(log);
// }

const sendSSEMessage = (event, msg) => {
  const messageId = new Date().getTime().toString();
  const data = {
    message: msg,
    isImporting
  }
  const ms = { event, id: messageId, data };
  sse.send(JSON.stringify(ms));
};


async function importMap(req, res) {
  let msg = 'Start to import map...'
  sendSSEMessage('import-map', msg)
  return new Promise((resolve, reject) => {
    const script = spawn('sh', [app_const.IMPORT_MAP]);

    script.stdout.on('data', (data) => {
      msg = data.toString();
      sendSSEMessage('import-map', msg)
    });

    script.stderr.on('data', (data) => {
      msg = `error: ${data.toString()}`;
      sendSSEMessage('import-map', msg)
    });

    script.stderr.on('error', (error) => {
      msg = `error: ${error}`;
      sendSSEMessage('import-map', msg)

      reject(error);
    });

    script.on('close', (code) => {
      if (code === 0) {
        msg = 'Map was imported.'
        sendSSEMessage('import-map', msg)
        res.status(200).send(msg);
        resolve();
      } else {
        msg = 'Failed to import map.'
        sendSSEMessage('import-map', msg)
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
    sendSSEMessage('upload-map', msg)
    return res.status(400).send(msg);
  }
  const uploadFile = req.files.mapFile;
  msg = `Upload file ${uploadFile.name}.`;
  sendSSEMessage('upload-map', msg)
  console.log(app_const.MAP_DATA)
  uploadFile.mv(app_const.MAP_DATA, function(err) {
    if (err) {
      msg = `File ${uploadFile.name} upload was failed.`
      console.log(err)
      // sendSSEMessage('upload-map', msg)
      return res.status(500).send(err);
    }
    msg = `File ${uploadFile.name} was uploaded.`
    console.log(msg)
    // sendSSEMessage('upload-map', msg)
  });
}

async function importMapHandler(req, res) {
  if (isImporting) {
    return res.status(400).send('Can not import map, an existing map is importing.')
  }

  isImporting = true;

  try{
    await uploadMap(req, res);
    // await importMap(req, res);
  } catch(error) {
    res.status(500).send(error);
  } finally {
    isImporting = false
  }
}

// var express = require('express');
// var arouter = express.Router();

// /* GET users listing. */
// arouter.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports={
  importMapHandler
};