const api = require ('./../api');

module.exports = (params, payload) => {

    let settings = {
        user_id: params.from_id,
        random_id: Date.now(),
        message: payload.message,
        //attachment: payload.attachment
    }

    let keyboard = JSON.stringify(payload.keyboard);
    if (keyboard) {
        settings.keyboard = keyboard;
    }

    let attachment = payload.attachment;
    if (attachment) {
        settings.attachment = attachment;
    }

    //console.log(settings);
    api('messages.send', settings);
}


