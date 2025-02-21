import { Router } from "express";
import { check } from "express-validator";
import { saveProduct, getProducts, getProductById, updateProduct, deleteProduct } from "./product.controller.js";
import { existeProductById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        validarCampos
    ],
    saveProduct
)

router.get("/", getProducts);

router.get(
    "/findProduct/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeProductById),
        validarCampos
    ],
    getProductById
)

router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeProductById),
        validarCampos
    ],
    updateProduct
)

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeProductById),
        validarCampos
    ],
    deleteProduct
)

export default router;