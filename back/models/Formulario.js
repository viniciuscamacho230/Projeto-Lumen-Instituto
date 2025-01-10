const mongoose = require('mongoose');

const RespostaSchema = new mongoose.Schema({
  resposta: String,
  pontos: Number,
});

const PerguntaSchema = new mongoose.Schema({
  texto_pergunta: String,
  opcoes_resposta: [RespostaSchema],
});

const FormularioSchema = new mongoose.Schema({
  titulo: String,
  selectedType: String,
  perguntasSelecionadas: [PerguntaSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  }
});

const Formulario = mongoose.model('Formulario', FormularioSchema);

module.exports = Formulario;