const axios = require ('axios');
const { stringify } = require ('querystring');
const { TOKEN } = require ('./config');

module.exports = async function (method, settings = {}) {
    try {
        const { data } = await axios.post(`https://api.vk.com/method/${method}`, stringify({
            v: 5.85,
            access_token: TOKEN,
            ...settings,
        }))

        if (data.error) {
            throw new Error(JSON.stringify(data))
        }
        //console.log(data);
        return data
    }
    catch (err) {
        throw new Error(err)
    }
}