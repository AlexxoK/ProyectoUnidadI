import { response, request } from "express";
import Product from "./product.model.js";

export const saveProduct = async (req, res) => {
    try {
        const data = req.body;

        const product = new Product(data);

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product saved successfully!',
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error saving product!',
            error
        })
    }
}

export const getProducts = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            products
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting products!',
            error
        })
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                msg: 'Product not found!'
            })
        }

        res.status(200).json({
            success: true,
            product
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting product!',
            error
        })
    }
}

export const updateProduct = async (req, res = response) => {
    try {
        
        const { id } = req.params;
        const data = req.body;

        const product = await Product.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Product update!',
            product
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error update!',
            error
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {

        const { id } = req.params;

        const product = await Product.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.status(200).json({
            success: true,
            message: 'Product delete success!',
            product
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting product!',
            error
        })
    }
}