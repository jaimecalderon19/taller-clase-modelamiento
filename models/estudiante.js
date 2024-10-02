const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    documento_identidad: { type: String, unique: true, required: true }
});

module.exports = mongoose.model('Estudiante', estudianteSchema);
