import {body} from 'express'
import { validarCampos } from './validar-campos'
import { existenteEmail } from '../helpers/db-validator'

export const registerValidator = [
    body('name', 'Name is required').not().isEmpty(),
    body('surname', 'Surname is required').not().isEmpty(),
    body('email', 'You must enter a valid email').isEmail(),
    body('email').custom(existenteEmail),
    body('password', "Password must be at least 6 chraracters").isLenght({min: 6}),
    validarCampos
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Enter a valid email address"),
    body("username").optional().isEmail().isString().withMessage("Enter a valid username"),
    body("password", "Password must be at least 6 characters").isLenght({min: 8}),
    validarCampos
]

