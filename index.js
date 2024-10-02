const mongoose = require('mongoose');
const inquirer = require('inquirer');
const servicios = require('./servicios');

const mongUri = process.env.DB_URL
const mongDatabase = process.env.DB_NAME

// Conexión a MongoDB
mongoose.connect(mongUri, {dbName:mongDatabase})
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB', err));

// Función para mostrar el menú principal
function mostrarMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'opcion',
            message: 'Seleccione una opción:',
            choices: ['Registrar estudiante', 'Registrar asignatura', 'Registrar nota', 'Consultar notas', 'Calcular promedio', 'Salir']
        }
    ]).then(respuesta => {
        switch (respuesta.opcion) {
            case 'Registrar estudiante':
                servicios.registrarEstudiante().then(() => mostrarMenu());
                break;
            case 'Registrar asignatura':
                servicios.registrarAsignatura().then(() => mostrarMenu());
                break;
            case 'Registrar nota':
                servicios.registrarNota().then(() => mostrarMenu());
                break;
            case 'Consultar notas':
                servicios.consultarNotas().then(() => mostrarMenu());
                break;
            case 'Calcular promedio':
                servicios.calcularPromedio().then(() => mostrarMenu());
                break;
            case 'Salir':
                mongoose.connection.close();
                console.log("Sesión finalizada.");
                break;
        }
    });
}

// Iniciar el programa mostrando el menú principal
mostrarMenu();