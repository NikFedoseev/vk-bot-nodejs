const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    group_number: {
        type: String,
        required: true
    },
    state: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('users', schema);