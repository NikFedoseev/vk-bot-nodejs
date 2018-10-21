const commands = require('./commands');
const sendMessage = require('./sendMessage');

module.exports = function (params) {
    //console.log(params);
    commands(params.text, params.from_id).then((payload) => {
        //console.log(payload.message);
        sendMessage(params, payload);
    })
}