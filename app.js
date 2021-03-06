require('dotenv').config();
const express = require ('express'); 
const bodyParser = require ('body-parser');
const {PORT, CONFIRMATION} = require ('./config');
const methods = require ('./methods');
const database = require ('./database');

const app = express ();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {    
  res.send('Тест'); 
});

app.post('/', (req, res) => {
  const {body} = req;
    switch (body.type) {
      case 'confirmation':
        res.end(CONFIRMATION);
        break;
      case 'message_new':
        let params = body.object;
        methods.processing(params);
        res.end('ok');
        break;
      default :
        res.end('ok');
        break;

    }
})

database()
  .then( info => {
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
  })
  .catch( err => {
    console.log(`Unable to connect to database ${err}`);
  })


app.listen(PORT, () => {
  console.log(`Сервер: порт ${PORT} - старт!`, PORT);
});