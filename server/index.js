// Habilita las variables de entorno
require('dotenv').config();

// Configura variables de entorno
require('../config/config.js');


console.log('/////////////////////////////////////////////', Date.now());
console.log('>> process.env.HOST=', process.env.HOST);
console.log('>> process.env.PORT=', process.env.PORT);
console.log('>> process.env.NODE_ENV =', process.env.NODE_ENV);
console.log('>> process.env.MONGO_URI = ', process.env.MONGO_URI);
console.log('>> process.env.URLDB = ', process.env.URLDB);
console.log('>> process.env.URL_SERVER = ', process.env.URL_SERVER);
console.log('/////////////////////////////////////////////');


//const cors = require('cors');

// Habilita servidor 
const express = require('express')
const app = express()

const { Nuxt, Builder } = require('nuxt')

const consola = require('consola')

const mongoose = require('mongoose');

const path = require('path');

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

app.set('port', process.env.PORT)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

///////////////////////////////

// Implementa CORS
//
////app.use(cors());
////app.use(function(rep, res, next){
////  res.setHeader("Access-control-Allow-Origin", "*");
////  res.setHeader("Access-control-Allow-Headers", "Content-Type");
////  res.setHeader("Access-control-Allow-Methods", 
////  "GET, PUT, POST, DELETE, OPTIONS");
////  next();
////});


// Carga las rutas api
app.use(require('../routes/index'));

// Configura Nuxt
setupNuxt();

// Arranca el servidor Express
app.listen(process.env.PORT, () => {
    console.log(`Nodejs ${process.env.NODE_ENV} Atendiendo peticiones  en el puerto ${process.env.PORT}`);
})

// Arranca elservidor MongoDB
console.log('HOST--------------> ' + process.env.URLDB);

mongoose.connect(process.env.URLDB, (err, resp) => {
    if (err) {
        return console.log('Hubo error al coenctar con MongoDB: ', err);
    };
    console.log(`Base de datos en la URL ${process.env.URLDB} esta ONLINE.`);
});

///////////////////////////////

// Configura el servidor nuxt para estar listo para arrancarlo.
async function setupNuxt() {
    // Init Nuxt.js
    const nuxt = new Nuxt(config)

    // Build only in dev mode
    if (config.dev) {
        const builder = new Builder(nuxt)
        await builder.build()
    }

    // Give nuxt middleware to express
    app.use(nuxt.render)

    // // // Listen the server
    // // app.listen(port, host)
    // // consola.ready({
    // //   message: `Server listening on http://${host}:${port}`,
    // //   badge: true
    // // })
}
