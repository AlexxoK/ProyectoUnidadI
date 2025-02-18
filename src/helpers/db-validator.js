import Role from '../role/role.model.js';
import User from '../users/user.model.js';

export const esRoleValido = async (role = ' ') => {
    const existeRol = await Role.findOne({ role });

    if (!existeRol) {
        throw new Error(`Role ${ role } does not exist in the database!`);
    }
}

export const existenteEmail = async (email = ' ') => {
    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
        throw new Error(`Email ${ email } exists in the database!`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);

    if (!existeUsuario) {
        throw new Error(`id ${ id } dont exists!`);
    }
}