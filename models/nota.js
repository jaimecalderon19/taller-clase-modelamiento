const mongoose = require('mongoose');

const notaSchema = new mongoose.Schema({
    estudiante_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Estudiante', required: true },
    asignatura_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Asignatura', required: true },
    nota: { type: Number, required: true }
});

module.exports = mongoose.model('Nota', notaSchema);
