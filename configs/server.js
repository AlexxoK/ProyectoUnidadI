'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { hash } from 'argon2';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';
import productRoutes from '../src/products/product.routes.js';
import categoryRoutes from '../src/categories/category.routes.js';
import facturaRoutes from '../src/facturas/factura.routes.js';
import carRoutes from '../src/cars/car.routes.js';

import Usuario from '../src/users/user.model.js';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) => {
    app.use("/gestorVentas/v1/auth", authRoutes);
    app.use("/gestorVentas/v1/users", userRoutes);
    app.use("/gestorVentas/v1/products", productRoutes);
    app.use("/gestorVentas/v1/categories", categoryRoutes);
    app.use("/gestorVentas/v1/facturas", facturaRoutes);
    app.use("/gestorVentas/v1/cars", carRoutes);
}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log('Succesful connecting to database!')
    } catch (error) {
        console.log('Error connecting to database!');
        process.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3002;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port ${port}!`);
    } catch (err) {
        console.log(`Server init failed: ${err}!`);
    }
}

export const createAdmin = async () => {
    try {
        const adminExists = await Usuario.findOne({ role: "ADMIN_ROLE" });

        if (!adminExists) {
            const hashedPassword = await hash("santosk027");

            const admin = new Usuario({
                name: "Elmer",
                surname: "Santos",
                username: "SantosK",
                email: "santosk@gmail.com",
                password: hashedPassword,
                phone: "12345678",
                role: "ADMIN_ROLE",
            });

            await admin.save();
            console.log("Administrador creado con éxito!");
        } else {
            console.log("El administrador ya existe!");
        }
    } catch (error) {
        console.error("Error al crear el administrador:", error.message);
    }
};

export const createClient = async () => {
    try {
        const clientExists = await Usuario.findOne({ role: "CLIENT_ROLE" });

        if (!clientExists) {
            const hashedPassword = await hash("alexxok027");

            const client = new Usuario({
                name: "Diego",
                surname: "Monterroso",
                username: "AlexxoK",
                email: "alexxok@gmail.com",
                password: hashedPassword,
                phone: "12345678",
                role: "CLIENT_ROLE",
            });

            await client.save();
            console.log("Cliente creado con éxito!");
        } else {
            console.log("El cliente ya existe!");
        }
    } catch (error) {
        console.error("Error al crear el cliente:", error.message);
    }
};