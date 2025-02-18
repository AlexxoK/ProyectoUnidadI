import jwt from 'jsonwebtoken';

import Usuario from '../users/user.model.js';

export const validarJWT = async (req, res, next) => {

    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            msg: "There is no token in the request!"
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Usuario does not exist in te database!'
            })
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token not valid - users with estado: false!'
            })
        }

        req.usuario = usuario;

        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Token not valid!"
        })
    }
}