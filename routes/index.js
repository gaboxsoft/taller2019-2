const express = require('express');

const app = express();


app.use(require('./login'));
app.use(require('./usuario'));
//app.use(require('./categoria'));
//app.use(require('./producto'));
//app.use(require('./upload'));
app.use(require('./server'));
app.use(require('./paciente'));
app.use(require('./reportes'));
app.use(require('./hojaInicialExpediente'));
app.use(require('./historiaClinica'));
app.use(require('./notaUrgencias'));
app.use(require('./evolucion'));



module.exports = app;
