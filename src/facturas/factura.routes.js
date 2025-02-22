import { Router } from "express";
import { check } from "express-validator";
import { saveFactura, getFacturas, getFacturaById, updateFactura, updateEstadoFactura } from "./factura.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";
import { existeFacturaById } from "../helpers/db-validator.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        validarCampos
    ],
    saveFactura
)

router.get("/", getFacturas)

router.get(
    "/findFactura/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeFacturaById),
        validarCampos
    ],
    getFacturaById
)

router.put(
    "/updateFactura/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeFacturaById),
        validarCampos
    ],
    updateFactura
)

router.put(
    "/updateEstadoFactura/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "id invalid!").isMongoId(),
        check("id").custom(existeFacturaById),
        validarCampos
    ],
    updateEstadoFactura
)

export default router;