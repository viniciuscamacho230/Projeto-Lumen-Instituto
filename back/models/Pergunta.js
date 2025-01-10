const mongoose = require('mongoose');

const perguntaSchema = new mongoose.Schema({
  texto_pergunta: {
    type: String,
    required: true
  },
  tipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Type' 
  },
  opcoes_resposta: [{
    resposta: {
      type: String,
      required: true
    },
    pontos: {
      type: Number,
      required: true
    }
  }]
});

const Pergunta = mongoose.model('Pergunta', perguntaSchema);

module.exports = Pergunta;
