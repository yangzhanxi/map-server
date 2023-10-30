const SSE = require('express-sse');

const {getIsImporting} = require('./importStatusHandler')

const sse = new SSE({
    retry: 10000,
});

const sseSendMsg = (event, msg) => {
    const timestamp = new Date().getTime().toString();
    sse.send({event, timestamp, message: msg, isImporting: getIsImporting()});
}

module.exports = {
    sse,
    sseSendMsg
}
