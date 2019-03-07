const mongoose = require('mongoose');

let Schema = mongoose.Schema;


// Schema de nombre de Persona


let nombrePersonaSchema = new Schema({
  // Nombre de persona
  pila: {
    type: String,
    minlength: 2,
    required: [true, 'El NOMBRE del paciente es necesario.']
  },
  paterno: {
    type: String,
    minlength: 2,
    required: [true, 'El PATERNO del paciente es necesario.']
  },
  materno: {
    type: String,
    //: [true, 'El MATERNO del paciente es necesario.']
  }
});


//module.exports = mongoose.model('NombrePersona', nombrePersonaSchema);
//module.exports = nombrePersonaSchema;
