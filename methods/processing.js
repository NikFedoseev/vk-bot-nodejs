const commands = require('./commands');
const sendMessage = require('./sendMessage');

module.exports = function (params) {
    //console.log(params.geo.coordinates);
    commands(params.text, params.from_id, params.geo ? params.geo.coordinates: null).then((payload) => {
        //console.log(payload.message);
        sendMessage(params, payload);
    })
}