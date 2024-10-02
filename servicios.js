const mongoose = require('mongoose');
const inquirer = require('inquirer');

// Importación de los modelos
const Estudiante = require('./models/estudiante');
const Asignatura = require('./models/asignatura');
const Nota = require('./models/nota');

// Función para registrar un estudiante
function registrarEstudiante() {
    return inquirer.prompt([
        { name: 'nombre', message: 'Nombre del estudiante:' },
        { name: 'documento', message: 'Documento de identidad:' }
    ]).then(respuestas => {
        const nuevoEstudiante = new Estudiante({
            nombre: respuestas.nombre,
            documento_identidad: respuestas.documento
        });
        return nuevoEstudiante.save().then(() => {
            console.log('Estudiante registrado con éxito.');
        }).catch(err => console.error('Error al registrar estudiante', err));
    });
}

// Función para registrar una asignatura
function registrarAsignatura() {
    return inquirer.prompt([
        { name: 'nombre', message: 'Nombre de la asignatura:' }
    ]).then(respuestas => {
        const nuevaAsignatura = new Asignatura({
            nombre: respuestas.nombre
        });
        return nuevaAsignatura.save().then(() => {
            console.log('Asignatura registrada con éxito.');
        }).catch(err => console.error('Error al registrar asignatura', err));
    });
}

function registrarNota() {
    return Estudiante.find().then(estudiantes => {
        const opcionesEstudiantes = estudiantes.map(est => ({
            name: `${est.nombre} (Documento: ${est.documento_identidad})`,
            value: est._id.toString()
        }));

        return inquirer.prompt([
            {
                type: 'list',
                name: 'estudiante_id',
                message: 'Seleccione el estudiante:',
                choices: opcionesEstudiantes
            }
        ]).then(resEstudiante => {
            return seleccionarAsignatura(resEstudiante.estudiante_id);
        });
    });
}

function seleccionarAsignatura(estudiante_id) {
    return Asignatura.find().then(asignaturas => {
        const opcionesAsignaturas = asignaturas.map(asg => ({
            name: asg.nombre,
            value: asg._id.toString()
        }));

        return inquirer.prompt([
            {
                type: 'list',
                name: 'asignatura_id',
                message: 'Seleccione la asignatura:',
                choices: opcionesAsignaturas
            },
            { name: 'nota', message: 'Nota (0.00 - 5.00):' }
        ]).then(respuestas => {
            const nuevaNota = new Nota({
                estudiante_id: estudiante_id,
                asignatura_id: respuestas.asignatura_id,
                nota: respuestas.nota
            });
            return nuevaNota.save().then(() => {
                console.log('Nota registrada con éxito.');
            });
        });
    });
}

function consultarNotas() {
    return Estudiante.find().then(estudiantes => {
        const opcionesEstudiantes = estudiantes.map(est => ({
            name: `${est.nombre} (Documento: ${est.documento_identidad})`,
            value: est._id.toString()
        }));

        return inquirer.prompt([
            {
                type: 'list',
                name: 'estudiante_id',
                message: 'Seleccione el estudiante:',
                choices: opcionesEstudiantes
            }
        ]).then(resEstudiante => {
            return Nota.find({ estudiante_id: resEstudiante.estudiante_id })
                .populate('asignatura_id', 'nombre')
                .then(notas => {
                    if (notas.length > 0) {
                        notas.forEach(nota => {
                            console.log(`Asignatura: ${nota.asignatura_id.nombre}, Nota: ${nota.nota}`);
                        });
                    } else {
                        console.log('No se encontraron notas para el estudiante.');
                    }
                });
        });
    });
}

function calcularPromedio() {
    return Estudiante.find().then(estudiantes => {
        const opcionesEstudiantes = estudiantes.map(est => ({
            name: `${est.nombre} (Documento: ${est.documento_identidad})`,
            value: est._id.toString()
        }));

        return inquirer.prompt([
            {
                type: 'list',
                name: 'estudiante_id',
                message: 'Seleccione el estudiante:',
                choices: opcionesEstudiantes
            }
        ]).then(resEstudiante => {
            return Nota.aggregate([
                { $match: { estudiante_id: new mongoose.Types.ObjectId(resEstudiante.estudiante_id) } },
                { $group: { _id: null, promedio: { $avg: "$nota" } } }
            ]).then(resultado => {
                if (resultado.length > 0) {
                    console.log(`Promedio del estudiante: ${resultado[0].promedio.toFixed(2)}`);
                } else {
                    console.log('No se encontraron notas para el estudiante.');
                }
            });
        });
    });
}

module.exports = {
    registrarEstudiante,
    registrarAsignatura,
    registrarNota,
    consultarNotas,
    calcularPromedio
};