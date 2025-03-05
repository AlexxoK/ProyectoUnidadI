import { response, request } from "express";
import { hash } from "argon2";
import User from "./user.model.js";
import { validarJWT } from '../middlewares/validar-jwt.js';

export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            users
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting users!',
            error
        })
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario not found!'
            })
        }

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting user!',
            error
        })
    }
}

export const updateUser = [validarJWT, async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, password, email, ...data } = req.body;

        if (req.usuario.id !== id) {
            return res.status(403).json({ success: false, msg: 'Unauthorized' });
        }

        if (password) {
            data.password = await hash(password);
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'User updated!',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error updating user!',
            error
        });
    }
}];

export const updatePassword = [validarJWT, async (req, res = response) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (req.usuario.id !== id) {
            return res.status(403).json({ success: false, msg: 'Unauthorized' });
        }

        if (!password) {
            return res.status(400).json({ success: false, msg: 'Password is required' });
        }

        const hashedPassword = await hash(password);
        const user = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Password updated!',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error updating password!',
            error
        });
    }
}];

export const deleteUser = [validarJWT, async (req, res = response) => {
    try {
        const { id } = req.params;

        if (req.usuario.id !== id) {
            return res.status(403).json({ success: false, msg: 'Unauthorized' });
        }

        const user = await User.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'User deactivated!',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error deactivating user!',
            error
        });
    }
}];

export const updateStatus = async (req, res = response) => {
    try {

        const { id } = req.params;
        const { estado } = req.body;

        if (password) {
            data.estado = await hash(estado)
        }

        const user = await User.findByIdAndUpdate(id, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Status update!',
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error update!',
            error
        })
    }
}