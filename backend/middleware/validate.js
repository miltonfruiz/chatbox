const { check, body, validationResult } = require('express-validator');

const validate = (method) => {
  switch (method) {
    case 'crearUsuario': {
      return [
        body('nombre', 'El nombre es obligatorio').not().isEmpty(),
        body('apellido', 'El apellido es obligatorio').not().isEmpty(),
        body('email', 'El email es obligatorio y debe ser válido').isEmail(),
        body('password', 'La contraseña es obligatoria y debe tener al menos 8 caracteres').not().isEmpty().isLength({ min: 8 }),
      ];
    }

    case 'login': {
      return [
        body('email', 'El email es obligatorio y debe ser válido').isEmail(),
        body('password', 'La contraseña es obligatoria').not().isEmpty(),
      ];
    }

    default:
      return [];
  }
};

module.exports = validate;