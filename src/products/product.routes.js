import { Router } from "express";
import { check } from "express-validator";
import { saveProduct, getProducts, getProductById, getProductByName, updateProduct, deleteProduct } from "./product.controller.js";
import { existeProductById, existeProductByName } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        validarCampos
    ],
    saveProduct
)

router.get("/", getProducts);

router.get(
    "/findProductById/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeProductById),
        validarCampos
    ],
    getProductById
)

router.get(
    "/findProductByName/:name",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE", "CLIENT_ROLE"),
        check("name", "Name is required!").notEmpty(),
        check("name").custom(existeProductByName),
        validarCampos
    ],
    getProductByName
);

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
    "/sell/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeProductById),
        validarCampos
    ],
    deleteProduct
)

router.delete(
    "/delete/:id",
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