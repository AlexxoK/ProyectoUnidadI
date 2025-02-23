import Product from "../products/product.model.js";
import Car from "../cars/car.model.js";
import Factura from "../facturas/factura.model.js";

export const addProductToCar = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            });
        }

        let car = await Car.findOne({ user: req.usuario.id });

        if (!car) {
            car = new Car({ user: req.usuario.id, products: [] });
        }

        const productIndex = car.products.findIndex(item => item.product.toString() === productId);

        if (productIndex > -1) {
            car.products[productIndex].quantity += quantity;
        } else {
            car.products.push({ product: productId, quantity });
        }

        await car.save();
        res.status(200).json({
            success: true,
            message: "Product added to cart!",
            car
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding product to cart!",
            error: error.message
        });
    }
};

export const getCar = async (req, res) => {
    try {
        const car = await Car.findOne({ user: req.usuario.id }).populate("products.product");

        if (!car) {
            return res.status(404).json({
                success: false,
                message: "Cart not found!"
            });
        }

        res.status(200).json({
            success: true,
            car
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching cart!",
            error: error.message
        });
    }
};

export const removeProductFromCar = async (req, res) => {
    try {
        const { productId } = req.params;

        let car = await Car.findOne({ user: req.usuario.id });

        if (!car) {
            return res.status(404).json({
                success: false,
                message: "Cart not found!"
            });
        }

        car.products = car.products.filter(item => item.product.toString() !== productId);
        await car.save();

        res.status(200).json({
            success: true,
            message: "Product removed from cart!",
            car
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error removing product from cart!",
            error: error.message
        });
    }
};


export const paidCar = async (req, res) => {
    try {
        let car = await Car.findOne({ user: req.usuario.id }).populate("products.product");

        if (!car || car.products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty!"
            });
        }

        let total = 0;
        for (let item of car.products) {
            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for product: ${item.product.name}`
                });
            }
            total += item.product.price * item.quantity;
        }

        const factura = new Factura({
            user: req.usuario.id,
            products: car.products.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            total,
            status: 'Paid'
        });

        await factura.save();

        for (let item of car.products) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity, sold: item.quantity }
            });
        }

        await Car.findOneAndDelete({ user: req.usuario.id });

        res.status(200).json({
            success: true,
            message: "Purchase completed successfully!",
            factura
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error during checkout!",
            error: error.message
        });
    }
};

export const history = async (req, res) => {
    try {
        const facturas = await Factura.find({ user: req.usuario.id }).populate("products.product");

        if (!facturas.length) {
            return res.status(404).json({
                success: false,
                message: "No purchase history found!"
            });
        }

        res.status(200).json({
            success: true,
            facturas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching purchase history!",
            error: error.message
        });
    }
};