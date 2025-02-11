import { Router } from 'express';
import { check } from 'express-validator';
import { saveAppoit, getAppoit, searchPet, deleteAppoit, updateAppoit } from './appoitment-controller.js';
import { existeAppoitById } from '../helpers/db-validator.js'
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.post(
    '/',
    [
        validarJWT,
        validarCampos
    ],
    saveAppoit
);

router.get('/', getAppoit);

router.get(
    '/:id',
    [
        validarJWT,
        check('id', 'id isnt valid').isMongoId(),
        validarCampos
    ],
    searchPet
);

router.delete(
    '/:id',
    [
        validarJWT,
        check('id', 'id is not valid').isMongoId(),
        validarCampos
    ],
    deleteAppoit
);

router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom(existeAppoitById),
        validarCampos
    ],
    updateAppoit
);

export default router;