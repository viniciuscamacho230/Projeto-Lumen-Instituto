const mongoose = require('mongoose');

const RespostaFormularioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  sobrenome: {
    type: String,
    required: true,
  },
  formulario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Formulario',
    required: true,
  },
  diagnostico: {
    type: String,
    required: false,
  },
  // Mudar depois pois está como String e não como ObjetoId
  empresa:{
    type: String,
  },
  respostas: [
    {
      pergunta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pergunta',
        required: true,
      },
      opcaoEscolhida: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resposta',
        required: true,
      },
      texto_pergunta: {
        type: String,
        required: true,
      },
      resposta: {
        type: String,
        required: true,
      },
      pontos: {
        type: Number,
        required: true,
      },
    },
  ],
});

const RespostaFormulario = mongoose.model('RespostaFormulario', RespostaFormularioSchema);

module.exports = RespostaFormulario;