const SSE = require('express-sse');

const sse = new SSE();

const sseSendMeg = (event, data) => {
    const id = new Date().getTime().toString();
    sse.send({event, id, data});
}

module.exports = {
    sse,
    sseSendMeg
}
