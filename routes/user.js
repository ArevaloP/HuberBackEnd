const {Router} = require('express');
const {check} = require('express-validator');

const { emailExist, existUserById } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const {validarArchivo} = require('../middlewares/validar-archivo');
const { postUser, actualizarImage, loginUser, revalidarToken, putUser, observarImage, validarPassword, getUserById } = require('../controllers/user');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


router.post('/', [
    check('name', 'El nombre debe ser obligatorio.').not().isEmpty(),
    check('lastName', 'El apellido debe ser obligatorio.').not().isEmpty(),
    check('email', 'El correo no es valido.').isEmail(),
    check('password', 'La contraseña debe contener mínimo 8 caracteres.').isLength({min: 8}),
    check('phone', 'El telefono es obligatorio.').not().isEmpty(),
    check('city', 'La ciudad es obligatoria.').not().isEmpty(),
    validarCampos
], postUser);

router.post('/login', [
   check('email', 'El correo es obligatorio').isEmail(),
   check('password', 'El password es obligatorio').not().isEmpty(),
   validarCampos 
], loginUser);

router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existUserById),
    validarCampos
], putUser);

router.put('/image/:id', [
    validarArchivo,
    check('id', 'No es un id valido de Mongo').isMongoId(),
    check('id').custom( existUserById ),
    validarCampos
], actualizarImage);


router.get('/rejsw', validarJWT, revalidarToken);

router.post('/validarPassword/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existUserById),
    validarCampos
], validarPassword);

router.get('/:id', [
    check('id', 'No es un id Valido').isMongoId(),
    check('id').custom(existUserById),
    validarCampos
], getUserById);

module.exports = router; 