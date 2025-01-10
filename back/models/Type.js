const mongoose = require('mongoose');

const Type = mongoose.model('Type', {
    name: String,
    description: String,
    totalAnswers: [{
        minPoints: Number,
        maxPoints: Number,
        response: String
    }]
});

module.exports = Type;
