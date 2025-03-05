import mongoose from "mongoose";
import Product from "../products/product.model.js";
import Category from "../categories/category.model.js";

export const saveCategory = async (req, res) => {
    try {
        const data = req.body;

        let productIds = [];

        if (data.productos && Array.isArray(data.productos) && data.productos.length > 0) {
            const products = await Product.find({ name: { $in: data.productos } });

            if (products.length !== data.productos.length) {
                return res.status(404).json({
                    success: false,
                    message: 'One or more products were not found!'
                });
            }

            productIds = products.map(product => product._id);
        }

        const category = new Category({
            ...data,
            productos: productIds
        });

        await category.save();

        res.status(200).json({
            success: true,
            message: 'Category created successfully!',
            category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error saving category!',
            error: error.message
        });
    }
};


export const getCategories = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: true };

    try {
        const categories = await Category.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('productos', 'name');

        const total = await Category.countDocuments(query);

        const categoriesWithProductNames = categories.map(category => ({
            ...category.toObject(),
            productos: category.productos.map(product => product.name)
        }));

        res.status(200).json({
            success: true,
            total,
            categories: categoriesWithProductNames
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting Categories!',
            error: error.message
        });
    }
};

export const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format!'
            });
        }

        const category = await Category.findById(id).populate('productos', 'name');

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found!'
            });
        }

        const categoryData = {
            ...category.toObject(),
            productos: category.productos.length
                ? category.productos.map(product => product.name)
                : ['No products found in this category']
        };

        res.status(200).json({
            success: true,
            category: categoryData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching category!',
            error: error.message
        });
    }
};

export const getProductsByCategory = async (req, res) => {
    const { name } = req.params;

    try {
        const category = await Category.findOne({ name: name }).populate('productos', 'name');

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found!'
            });
        }

        const categoryData = {
            ...category.toObject(),
            productos: category.productos.length
                ? category.productos.map(product => product.name)
                : ['No products found in this category']
        };

        res.status(200).json({
            success: true,
            category: categoryData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching category!',
            error: error.message
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found!'
            });
        }

        let productIds = existingCategory.productos;
        if (data.productos && Array.isArray(data.productos)) {
            const products = await Product.find({ name: { $in: data.productos } });

            if (products.length !== data.productos.length) {
                return res.status(404).json({
                    success: false,
                    message: 'One or more products were not found!'
                });
            }

            productIds = products.map(product => product._id);
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            {
                ...data,
                productos: productIds
            },
            { new: true }
        ).populate('productos', 'name');

        res.status(200).json({
            success: true,
            message: 'Category updated successfully!',
            category: {
                ...updatedCategory.toObject(),
                productos: updatedCategory.productos.map(product => product.name)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating category!',
            error: error.message
        });
    }
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const categoryToDelete = await Category.findById(id);
        if (!categoryToDelete || !categoryToDelete.status) {
            return res.status(404).json({
                success: false,
                message: 'Category not found or already deleted!'
            });
        }

        let defaultCategory = await Category.findOne({ name: 'Sin Categoría' });

        if (!defaultCategory) {
            defaultCategory = new Category({
                name: 'Sin Categoría',
                description: 'Categoría para productos sin clasificación',
                productos: [],
                status: true
            });
            await defaultCategory.save();
        }

        const productsToMove = categoryToDelete.productos;
        defaultCategory.productos.push(...productsToMove);
        await defaultCategory.save();

        await Category.findByIdAndUpdate(id, { status: false });

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully! All products moved to the default category!'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting category!',
            error: error.message
        });
    }
};