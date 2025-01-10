const mongoose = require('mongoose');

const diagnosticoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  formularios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Formulario' }],
  empresa: { type: mongoose.Schema.Types.ObjectId, ref: 'Empresa', required: false },
});

const Diagnostico = mongoose.model('Diagnostico', diagnosticoSchema);

module.exports = Diagnostico;
