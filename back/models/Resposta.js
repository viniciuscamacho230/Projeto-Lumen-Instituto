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
  selectedType: String,
  perguntasSelecionadas: [
    {
      perguntaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pergunta' },
      respostaEscolhida: String, 
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Resposta = mongoose.model('Resposta', FormularioSchema, );

module.exports = Resposta;