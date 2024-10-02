const mongoose = require('mongoose');

const asignaturaSchema = new mongoose.Schema({
    nombre: { type: String, required: true }
});

module.exports = mongoose.model('Asignatura', asignaturaSchema);
