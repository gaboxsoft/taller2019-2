const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const situacionValida = require('./situacionValida');


// Schema de sello de tiempo de creacion, borrado y modificación

let selloSchema = new Schema({
  // Sello de creación y borrado 

  fechaCreacion: {
    type: Date,
    required: [true, 'La fecha de creación es necesaria.']
    ,
    default: () => { new Date().toLocaleString() }
  },
  fechaModificacion: {
    type: Date
  },
  situacion: {
    type: Number,
    required: [true, 'La situación deldocumento es necesaria.'],
    enum: situacionValida,
    default: 1 // 0-borrardo,  1-activo
  },
  fechaBorrado: {
    type: Date
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }
});


//module.exports = mongoose.model('Sello', selloSchema);
//module.exports = selloSchema;
