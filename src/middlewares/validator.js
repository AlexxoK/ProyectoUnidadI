import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { existenteEmail, esRoleValido } from "../helpers/db-validator.js";

export const registerValidator = [
    body("name", "The naem is required!").not().isEmpty(),
    body("surname", "The surnaem is required!").not().isEmpty(),
    body("email", "You must enter a valid email!").isEmail(),
    body("email").custom(existenteEmail),
    body('role').custom(esRoleValido),
    body("password", "Password must be at least 8 cahracters!").isLength({ min: 8 }),
    validarCampos
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Enter a valid email address!"),
    body("username").optional().isString().withMessage("Enter a valid username!"),
    body("password", "Password must be at least 8 characters!").isLength({ min: 8 }),
    validarCampos
];