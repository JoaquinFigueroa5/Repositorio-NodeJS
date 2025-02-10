import { Router } from 'express';
import { check } from 'express-validator';
import { savePet, getPets, searchPet, deletePet, updatePet } from './pet.controller.js';
import { existePetById } from '../helpers/db-validator.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check('email', 'That email is invalid').not().isEmpty(),
        validarCampos
    ],
    savePet
)

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existePetById),
        validarCampos
    ],
    updatePet
)

router.get('/', getPets)

router.get(
    "/:id",
    [
        validarJWT,
        check("id", "Not is an ID valid").isMongoId(),
        validarCampos
    ],
    searchPet
)

router.delete(
    "/:id",
    [
        validarJWT,
        check('id', 'not is a valid ID').isMongoId(),
        validarCampos
    ],
    deletePet
)

export default router;