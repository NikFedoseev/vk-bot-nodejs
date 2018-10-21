require('dotenv').config();
const {MONGO_URL} = require ('./config');
const mongoose = require ('mongoose');

module.exports = () => {
    return new Promise ((resolve, reject) => {
        mongoose.Promise = global.Promise;
        mongoose.set('debug', true);

        mongoose.connect('mongodb://127.0.0.1:27017/users', { useNewUrlParser: true });
        mongoose.connection
            .on('error', error => reject(error))
            .on('close', () => console.log('Database connection closed'))
            .once('open', () => resolve(mongoose.connection));
        
       
    });
}
