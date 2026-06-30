// Importación de mongoose
const mongoose = require('mongoose');

// Conexión a la base de datos
mongoose.connect('mongodb://localhost/chat-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Esquema del mensaje
const mensajeSchema = new mongoose.Schema({
  texto: String,
  usuario: String,
  fecha: Date,
});

// Modelo del mensaje
const Mensaje = mongoose.model('Mensaje', mensajeSchema);

// Esquema del usuario
const usuarioSchema = new mongoose.Schema({
  nombre: String,
  email: String,
});

// Modelo del usuario
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Esquema de la conversación
const conversacionSchema = new mongoose.Schema({
  usuarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
  mensajes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mensaje' }],
});

// Modelo de la conversación
const Conversacion = mongoose.model('Conversacion', conversacionSchema);