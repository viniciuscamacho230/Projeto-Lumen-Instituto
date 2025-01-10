const mongoose = require('mongoose');

const EmpresaSchema = new mongoose.Schema({
    nome: String,
    logo: String,
    cnpj: String,
    nomeDono: String,
    descricao: String,
    segmento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Segmento' 
    }
});

const Empresa = mongoose.model('Empresa', EmpresaSchema);

module.exports = Empresa;
