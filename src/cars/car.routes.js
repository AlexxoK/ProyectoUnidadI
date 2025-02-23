import { Router } from "express";
import { check } from "express-validator";
import { addProductToCar, getCar, removeProductFromCar, paidCar, history } from "./car.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    "/car",
    [
        validarJWT,
        tieneRole("CLIENT_ROLE"),
        check("productId", "Product ID is invalid!").isMongoId(),
        check("quantity", "Quantity must be a number").isInt({ gt: 0 }),
        validarCampos
    ],
    addProductToCar
);

router.get("/", validarJWT, getCar);

router.delete(
    "/:productId",
    [
        validarJWT,
        tieneRole("CLIENT_ROLE"),
        check("productId", "Product ID is invalid!").isMongoId(),
        validarCampos
    ],
    removeProductFromCar
);

router.post(
    "/paidCar",
    [
        validarJWT,
        tieneRole("CLIENT_ROLE"),
        validarCampos
    ],
    paidCar
);

router.get("/history", validarJWT, history);

export default router;