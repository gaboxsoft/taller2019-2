const Paciente = require('../models/paciente');
const NotaUrgencias = require('../models/notaUrgencias');
const Evolucion = require('../models/evolucion');

const express = require('express');
const app = express();

let { verificaToken, verificaAdminRol } = require('../middleware/autenticacion');

const fs = require('fs');
const path = require('path');
const pdf = require('pdfkit');
const pdfTools = require('../library/pdfkit/gxPdf');
const hojaInicialExpedientePdf = require('../library/msiReportes/hojaInicialExpedientePdf');
const historiaClinicaPdf = require('../library/msiReportes/historiaClinicaPdf');
const notaUrgenciasPdf = require('../library/msiReportes/notaUrgenciasPdf');
const hojaEvolucionPdf = require('../library/msiReportes/hojaEvolucionPdf');

const axios = require('axios');

//app.get('/contrato', verificaToken, function(req, res) {
app.get('/msi00/:id', function (req, res) {

  console.log('generando contrato..................');
  contratoPdf();

  ////rpt.save('CMSI-00-contrato.pdf');


  return res.status(200).json({ ok: true, data: 'todo bien....' });
});

app.get('/msi10/:id', function (req, res) {

  //console.log('generando hoja inicial..................');
  //console.log('TOKEN..................', req.get('token'));
  //console.log('TOKEN..................', req.params.id);
  // fs.writeFile('~/req.txt',)
  // Obtener el paciente
  const id = req.params.id;
  let token = req.get('token');
  Paciente.findById(id, (err, pacienteBD) => {
    if (err) {
      return res.status(400).
        json({ ok: false, error: 'Error al generar reporte MSI-10 ' + err });
    };
    console.log(`0.-voy a ir a crear hoja inicial exp: `);
    let filePath = hojaInicialExpedientePdf(pacienteBD);

    return res.status(200).json({ ok: true, menssaje: 'Se genero el formato MSI-10', pdfFile: process.env.URL_SERVER + '/pdfs/' + path.basename(filePath) });

  });


  //return res.status(200).json({ ok: false, mensaje: 'Falló al buscar el Paciente.' });
});

app.get('/msi11/:id', function (req, res) {

  console.log('generando historia clinica');
  //console.log('TOKEN..................', req.get('token'));
  //console.log('ID PACIENTE..................', req.params.id);

  // Obtener el paciente
  const id = req.params.id;
  let token = req.get('token');
  Paciente.findById(id, (err, pacienteBD) => {
    if (err) {
      return res.status(400).
        json({ ok: false, error: 'Error al generar reporte MSI-11 ' + err });
    };
    //console.log(`0.-voy a ir a crear hoja exp: `);
    let filePath = historiaClinicaPdf(pacienteBD);
    //console.log('path=', path.dirname(filePath), "name=", path.basename(filePath))
    //return res.download(path.dirname(filePath), path.basename(filePath));

    return res.status(200).json({ ok: true, menssaje: 'Se genero el formato MSI-11', pdfFile: process.env.URL_SERVER + '/pdfs/' + path.basename(filePath) });

  });

  //return res.status(200).json({ ok: false, mensaje: 'Falló al buscar el Paciente.' });
});

app.get('/msi12/:id', function (req, res) {

  console.log('generando nota Urgencias');
  //console.log('TOKEN..................', req.get('token'));
  //console.log('ID PACIENTE..................', req.params.id);
  //console.log('ID NOTA URGENCIAS..................', req.params.notaUrgenciasId);

  // Obtener el paciente
  const id = req.params.id;
  let token = req.get('token');
  let notaUrgenciasId = req.get('notaUrgenciasId');

  Paciente.findById(id, (err, pacienteBD) => {
    if (err) {
      return res.status(400).
        json({ ok: false, error: '1.- Error al generar reporte MSI-12 ' + err });
    };
    if (!pacienteBD) {
      return res.status(400).
        json({ ok: false, error: '2.- Error al generar reporte MSI-12: No existe paciente ' });
    };
      NotaUrgencias.findById(notaUrgenciasId, (errNotaUrgencias, notaUrgenciasBD) => {
        if (errNotaUrgencias) {
          return res.status(400).
            json({ ok: false, error: '3.- Error al generar reporte MSI-12: ', errNotaUrgencias});
        };
        if (!notaUrgenciasBD) {
          return res.status(400).
            json({ ok: false, error: '4.- Error al generar reporte MSI-12: No existe Nota Urgencias ' });
        };
        //console.log(`0.-voy a ir a crear hoja exp: `);
        let filePath = notaUrgenciasPdf(pacienteBD, notaUrgenciasBD);
        //console.log('path=', path.dirname(filePath), "name=", path.basename(filePath))
        //return res.download(path.dirname(filePath), path.basename(filePath));

        return res.status(200).json({ ok: true, menssaje: 'Se genero el formato MSI-11', pdfFile: process.env.URL_SERVER + '/pdfs/' + path.basename(filePath) });
      });
    

  });

  //return res.status(200).json({ ok: false, mensaje: 'Falló al buscar el Paciente.' });
});

app.get('/msi14/:id', function (req, res) {

  console.log('generando Hoja de Eolución');
  //console.log('TOKEN..................', req.get('token'));
  //console.log('ID PACIENTE..................', req.params.id);

  // Obtener el paciente
  const id = req.params.id;
  let token = req.get('token');
  //let notaUrgenciasId = req.get('notaUrgenciasId');

  Paciente.findById(id, (err, pacienteBD) => {
    if (err) {
      return res.status(400).
        json({ ok: false, error: '1.- Error al generar reporte MSI-14 ' + err });
    };
    if (!pacienteBD) {
      return res.status(400).
        json({ ok: false, error: '2.- Error al generar reporte MSI-14: No existe paciente ' });
    };

    Evolucion.find({ 'situacionSe': { $eq: 1 }, 'paciente': { $eq: id } })      
      .sort({ fecha: 'desc' })
      .exec((err, evolucionesBD) => {
        if (err) {
          return res.status(400).
            json({ ok: false, error: err });
        };
        if (!evolucionesBD) {
          return res.json({ ok: true, conteo: 0, evoluciones: {}, mensaje: 'No hay hoja de evolución.' });
        };


        let filePath = hojaEvolucionPdf(pacienteBD, evolucionesBD);
        //console.log('path=', path.dirname(filePath), "name=", path.basename(filePath))
        //return res.download(path.dirname(filePath), path.basename(filePath));

        return res.status(200).json({ ok: true, menssaje: 'Se genero el formato MSI-11', pdfFile: process.env.URL_SERVER + '/pdfs/' + path.basename(filePath) });

      });




  });

  //return res.status(200).json({ ok: false, mensaje: 'Falló al buscar el Paciente.' });
});


module.exports = app;




function contratoPdf() {
  const hojaCartaPort = [612, 792];
  const hojaCartaLan = [792, 612];
  
  var doc = new pdf({
    size: 'letter',
    layout: 'portrait',
    //size: hojaCartaPort,
    margin: 0,
    info: {
      Title: 'Contrato de Prestación de Servicios: msi-00 v1.0',
      Author: 'Clínica Médica San Isidro',
    }
  });
  //doc.lineWidth(3);
  //doc.lineJoin('round')
  //  .rect(5, 5, 600, 750)
  //  .stroke();


  const anchoHoja = pdfTools.mmToPt(210.02); // ptos: 612;
  const altoHoja = pdfTools.mmToPt(297.01);  // Ptos: 792;
  const margenIzq = 10;
  const margenDer = 10;
  const maxAncho = anchoHoja - margenDer - margenIzq;
  const margenSup = 10;
  const margenInf = 10;
  const maxAlto = altoHoja - margenInf - margenSup;
  const sizePaperLetter = '210.02x297.01';
  const centroMedico = 'Médica San Isidro';
  //const paciente = {
  //  nombre: 'JUANA DIAZ VELARDE',
  //  domicilio: {
  //    calle: 'LAGUNA DE SAN PABLO',
  //    numeroInterior: '#24',
  //    colonia: 'CIPRES',
  //    municipio: 'SAN JERÓNIMO',
  //    entidad: 'PUEBLA',
  //    pais:'MÉXICO'
  //    },
  //  telefono: '7834571113',
  //  fechaNacimiento: Date.now()
  //};
  const imgFormato = path.join(__dirname, '../msiFormatos/msi10.jpg');
  console.log('imagen------------>>>> ', imgFormato);

  doc.image(imgFormato, {
    fit: [anchoHoja,altoHoja]
  });
  
  // Nombre
  doc.moveDown()
    .fillColor('black')
    .fontSize(12)
    .text(paciente.nombre, pdfTools.cmToPt(3.2), pdfTools.cmToPt(5.1), {
      align: 'left',
      indent: 2,
      height: 2,
      ellipsis: true
    });
  // Teléfono
  doc.moveDown()
    .fillColor('black')
    .fontSize(12)
    .text(paciente.telefonos, pdfTools.cmToPt(3.5), pdfTools.cmToPt(6.425), {
      align: 'left',
      indent: 2,
      height: 2,
      ellipsis: true
    });
  // Calle y número
  const domicilio = paciente.calle + ' ' + paciente.numeroInterior ;
  doc.moveDown()
    .fillColor('black')
    .fontSize(12)
    .text(domicilio, pdfTools.cmToPt(4.5), pdfTools.cmToPt(6), {
      align: 'left',
      indent: 2,
      height: 2,
      ellipsis: true
    });
  // Colonia
  doc.moveDown()
    .fillColor('black')
    .fontSize(12)
    .text(paciente.colonia, pdfTools.cmToPt(6.5), pdfTools.cmToPt(6.05), {
      align: 'left',
      indent: 2,
      height: 2,
      ellipsis: true
    });
  // Municipio
  doc.moveDown()
    .fillColor('black')
    .fontSize(12)
    .text(paciente.municipio, pdfTools.cmToPt(8.5), pdfTools.cmToPt(6.05), {
      align: 'left',
      indent: 2,
      height: 2,
      ellipsis: true
    });
  //// Teléfono
  //doc.moveDown()
  //  .fillColor('black')
  //  .fontSize(12)
  //  .text(paciente.domiclio, pdfTools.cmToPt(3.5), pdfTools.cmToPt(12), {
  //    align: 'left',
  //    indent: 2,
  //    height: 2,
  //    ellipsis: true
  //  });


 

  //doc.moveDown()
  //  .fillColor('black')
  //  .fontSize(4)
  //  .text(encabezado, {
  //    align: 'justify'
  //  });
  //doc.moveDown()
  //  .fillColor('black')
  //  .fontSize(4)
  //  .text('CLAÚSULAS', {
  //    align: 'center',
  //    indent: 2,
  //    height: 2,
  //    ellipsis: true
  //  });


  //for (var i = 0; i < clausulas.length;  i++) {
  //  line = `${clausulas[i].numero}${clausulas[i].texto}`;
  //  doc.moveDown();
  //  doc.moveDown()
  //    .fillColor('black')
  //    .fontSize(4)
  //    .text(line, {
  //      align: 'justify'
  //    });
  //};
  doc.moveDown();
  doc.moveDown()
    .fillColor('black')
    .fontSize(12)
    .text('HelloäöüßÄÖÜ©µ®', {
      align: 'justify',
      indent: 2,
      height: 2,
      ellipsis: true
    });
  // Stream contents to a file
  doc.pipe(fs.createWriteStream('msi-00-Contrato'+ '.pdf')).on('finish', function () {
    console.log('Archivo creado satisfactoriamente ....');
  });

  doc.end();

  //var buffer = encoding.convert(data, "Latin_1") 
}


function convierteSVG2PDF() {
  var fs = require('fs');


  var doc = new pdf();
  stream = fs.createWriteStream('file.pdf');
  const pathSvgFile = path.normalize('C:/Users/Isecuriti/Desktop/node/MSI Formatos para digitalización/CMSI-00-Contrato-de-prestacion-servicios.svg');

  const svg = fs.readFileSync(pathSvgFile);

  SVGtoPDF(doc, svg, 0, 0);

  stream.on('finish', function () {
    console.log(fs.readFileSync('file.pdf'))
  });

  doc.pipe(stream);
  doc.end();

}











function ejemploPdf() {

  nombre = 'gabriel';
  apellidoPaterno = 'zuáres';
  apellidoMaterno = 'valdez';

  var doc = new pdf({
    //size: 'LETTER',
    layout: 'portrain',
    size: [210, 277],
    margin: 5,
    info: {
      Title: 'Contrato de Prestación de Servicios',
      Author: 'Clínica Médica San Isidro',
    }
  });

  // Write stuff into PDF
  doc.moveDown()
    .fillColor('black')
    .fontSize(4)
    .text('EJEMPLO DE DOCUMENTO PDF', {
      align: 'center',
      indent: 2,
      height: 2,
      ellipsis: true
    });


  doc.moveDown()
    .fillColor('black')
    .fontSize(4)
    .text('NOMBRE DE PERSONAS DESDE FORMULARIO', {
      align: 'center',
      indent: 2,
      height: 2,
      ellipsis: true
    });



  doc.moveDown()
    .fillColor('black')
    .fontSize(8)
    .text('NOMBRE: ' + nombre + ' ' + apellidoPaterno + ' ' + apellidoMaterno, {
      align: 'left',
      indent: 2,
      height: 2,
      ellipsis: true
    });

  // Stream contents to a file
  doc.pipe(fs.createWriteStream(nombre + "_" + apellidoPaterno + "_" + apellidoMaterno + '.pdf')).on('finish', function () {
    console.log('Archivo creado satisfactoriamente ....');
  });

  doc.end();

};
