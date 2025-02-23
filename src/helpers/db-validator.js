import Role from '../role/role.model.js';
import User from '../users/user.model.js';
import Product from "../products/product.model.js";
import Category from '../categories/category.model.js';
import Factura from '../facturas/factura.model.js';

export const esRoleValido = async (role = ' ') => {
    const existeRol = await Role.findOne({ role });

    if (!existeRol) {
        throw new Error(`Role ${role} does not exist in the database!`);
    }
}

export const existenteEmail = async (email = ' ') => {
    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
        throw new Error(`Email ${email} exists in the database!`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);

    if (!existeUsuario) {
        throw new Error(`id ${id} dont exists!`);
    }
}

export const existeProductById = async (id = '') => {
    const existeProduct = await Product.findById(id);

    if (!existeProduct) {
        throw new Error(`id ${id} dont exists!`);
    }
}

export const existeProductByName = async (name = '') => {
    const existeProduct = await Product.findById(name);

    if (!existeProduct) {
        throw new Error(`name ${name} dont exists!`);
    }
}

export const existeCategoryById = async (id = '') => {
    const existeCategory = await Category.findById(id);

    if (!existeCategory) {
        throw new Error(`id ${id} dont exists!`);
    }
}

export const existeFacturaById = async (id = '') => {
    const existeFactura = await Factura.findById(id);

    if (!existeFactura) {
        throw new Error(`id ${id} dont exists!`);
    }
}