const mongoose = require('mongoose');

const Segmento = mongoose.model('Segmento', {
    name: String,
    description: String
});

module.exports = Segmento;
