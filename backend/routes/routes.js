const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const usuarios = [
  { id: 1, nombre: 'admin', password: 'admin' }
];

const secretKey = 'mi-llave-secreta';

function generarToken(usuario) {
  return jwt.sign({ id: usuario.id, nombre: usuario.nombre }, secretKey, { expiresIn: '1h' });
}

function verificarToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Acceso denegado. No se proporcionó token.');
  try {
    const decoded = jwt.verify(token, secretKey);
    req.usuario = decoded;
    next();
  } catch (ex) {
    return res.status(400).send('Token inválido.');
  }
}

app.post('/login', (req, res) => {
  const usuario = usuarios.find(u => u.nombre === req.body.nombre && u.password === req.body.password);
  if (!usuario) return res.status(400).send('Usuario o contraseña inválidos.');
  const token = generarToken(usuario);
  res.send(token);
});

app.get('/perfil', verificarToken, (req, res) => {
  res.send(`Hola, ${req.usuario.nombre}!`);
});

app.get('/chat', verificarToken, (req, res) => {
  res.send('Bienvenido al chat!');
});

app.post('/mensaje', verificarToken, (req, res) => {
  console.log(`Mensaje de ${req.usuario.nombre}: ${req.body.mensaje}`);
  res.send('Mensaje enviado!');
});

const puerto = 3000;
app.listen(puerto, () => console.log(`Servidor escuchando en el puerto ${puerto}`));