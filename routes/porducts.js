const {Router} = require('express');
const {check} = require('express-validator');
const { postProducts, getProducts, getProductoByIdUser, deleteProduct } = require('../controllers/products');
const { existUserById, existProductById } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/', [
    validarJWT,
    check('type', 'El tipo es obligatorio').not().isEmpty(),
    check('city', 'La ciiudad es obligatoria').not().isEmpty(),
    check('price', 'El precio es obligatorio').not().isEmpty(),
    check('desc', 'La descripcion es obligatoria').not().isEmpty(),
    check('address', 'La direccion es obligatoria').not().isEmpty(),
    validarCampos
], postProducts);

router.get('/', validarJWT, getProducts);

router.get('/getProductsOfUser/:idUser',[
    check('idUser', 'No es un id valido').isMongoId(),
    validarCampos
], getProductoByIdUser);

router.delete('/:id', [
    validarJWT,
    check('id', 'No es un id valido'),
    check('id').custom(existProductById), 
    validarCampos
], deleteProduct);


module.exports = router; 