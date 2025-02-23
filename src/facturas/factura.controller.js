import mongoose from "mongoose";
import Factura from "../facturas/factura.model.js";
import Product from "../products/product.model.js";

export const saveFactura = async (req, res) => {
    try {
        const data = req.body;

        let productDetails = [];
        let total = 0;

        if (!data.user || !data.products || !Array.isArray(data.products) || data.products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "User and products are required!",
            });
        }

        for (let item of data.products) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${item.product} not found!`,
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product: ${product.name}`,
                });
            }

            product.stock -= item.quantity;
            product.sold += item.quantity;
            product.outOfStock = product.stock === 0;
            await product.save();

            productDetails.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
            });

            total += product.price * item.quantity;
        }

        const factura = new Factura({
            user: data.user,
            products: productDetails,
            total,
            status: "Pending",
        });

        await factura.save();

        res.status(200).json({
            success: true,
            message: "Factura created successfully!",
            factura,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error saving factura!",
            error: error.message,
        });
    }
};

export const getFacturas = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: { $ne: "Cancelled" } };

    try {
        const facturas = await Factura.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate("user", "name")
            .populate("products.product", "name price");

        const total = await Factura.countDocuments(query);

        const formattedFacturas = facturas.map(factura => ({
            _id: factura._id,
            user: factura.user ? factura.user.name : "User not found!",
            products: factura.products.map(item => ({
                name: item.product ? item.product.name : "Product not found!",
                price: item.product ? item.product.price : 0,
                quantity: item.quantity
            })),
            total: factura.total,
            status: factura.status,
            createdAt: factura.createdAt,
            updatedAt: factura.updatedAt
        }));

        res.status(200).json({
            success: true,
            total,
            facturas: formattedFacturas
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting facturas!",
            error: error.message
        });
    }
};

export const getFacturaById = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format!",
            });
        }

        const factura = await Factura.findById(id)
            .populate("user", "name")
            .populate("products.product", "name price");

        if (!factura) {
            return res.status(404).json({
                success: false,
                message: "Factura not found!",
            });
        }

        const facturaData = {
            _id: factura._id,
            user: factura.user ? factura.user.name : "User not found!",
            products: factura.products.map(item => ({
                name: item.product ? item.product.name : "Product not found!",
                price: item.product ? item.product.price : 0,
                quantity: item.quantity,
            })),
            total: factura.total,
            status: factura.status,
            createdAt: factura.createdAt,
            updatedAt: factura.updatedAt,
        };

        res.status(200).json({
            success: true,
            factura: facturaData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error searching factura!",
            error: error.message,
        });
    }
};

export const updateFactura = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const existingFactura = await Factura.findById(id);
        if (!existingFactura) {
            return res.status(404).json({
                success: false,
                message: 'Factura not found!'
            });
        }

        let newProductDetails = [];
        let total = 0;

        for (let item of existingFactura.products) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                product.sold -= item.quantity;
                product.outOfStock = product.stock === 0;
                await product.save();
            }
        }

        for (let item of data.products) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${item.product} not found!`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product: ${product.name}`
                });
            }

            product.stock -= item.quantity;
            product.sold += item.quantity;
            product.outOfStock = product.stock === 0;
            await product.save();

            newProductDetails.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });

            total += product.price * item.quantity;
        }

        existingFactura.products = newProductDetails;
        existingFactura.total = total;
        existingFactura.status = data.status || existingFactura.status;

        await existingFactura.save();

        const updatedFactura = await Factura.findById(id)
            .populate('products.product', 'name');

        const formattedFactura = {
            ...updatedFactura.toObject(),
            products: updatedFactura.products.map(item => ({
                name: item.product ? item.product.name : "Product not found!",
                price: item.product ? item.product.price : 0,
                quantity: item.quantity
            }))
        };

        res.status(200).json({
            success: true,
            message: 'Factura updated successfully!',
            factura: formattedFactura
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating factura!',
            error: error.message
        });
    }
};

export const updateEstadoFactura = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'Paid', 'Cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status value. Allowed values are: ${validStatuses.join(', ')}`
            });
        }

        const factura = await Factura.findById(id);
        if (!factura) {
            return res.status(404).json({
                success: false,
                message: 'Factura not found!'
            });
        }

        if (factura.status === status) {
            return res.status(200).json({
                success: true,
                message: 'No changes made. The invoice is already in the requested status.',
                factura
            });
        }

        factura.status = status;

        await factura.save();

        const updatedFactura = await Factura.findById(id)
            .populate('user', 'name')
            .populate('products.product', 'name price');

        const formattedFactura = {
            ...updatedFactura.toObject(),
            user: updatedFactura.user ? updatedFactura.user.name : "User not found!",
            products: updatedFactura.products.map(item => ({
                name: item.product ? item.product.name : "Product not found!",
                price: item.product ? item.product.price : 0,
                quantity: item.quantity
            }))
        };

        res.status(200).json({
            success: true,
            message: 'Factura status updated successfully!',
            factura: formattedFactura
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating factura status!',
            error: error.message
        });
    }
};