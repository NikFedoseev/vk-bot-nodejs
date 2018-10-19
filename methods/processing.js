const commands = require ('./commands');
const sendMessage = require ('./sendMessage');

module.exports = function(params) {
    commands(params.text).then((payload) => {
        //console.log(payload.message);
        sendMessage(params, payload);
    })
}
