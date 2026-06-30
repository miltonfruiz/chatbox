const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario'); // Asumiendo que tienes un modelo de Usuario

const register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }

        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const nuevoUsuario = new Usuario({ nombre, email, password: hashedPassword });
        await nuevoUsuario.save();

        res.status(201).json({ mensaje: 'Usuario creado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar el usuario' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(404).json({ mensaje: 'El usuario no existe' });
        }

        const isValidPassword = await bcrypt.compare(password, usuario.password);
        if (!isValidPassword) {
            return res.status(401).json({ mensaje: 'Contraseña inválida' });
        }

        const token = jwt.sign({ id: usuario._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al iniciar sesión' });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.json({ mensaje: 'Sesión cerrada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al cerrar la sesión' });
    }
};

module.exports = { register, login, logout };