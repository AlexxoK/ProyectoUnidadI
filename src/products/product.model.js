import { Schema, model } from "mongoose";

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, "The name is required!"],
        maxLength: 25,
    },

    description: {
        type: String,
        required: [true, "Description is required!"],
        maxLength: [500, "500 characters maximum!"],
    },

    price: {
        type: Number,
        required: [true, "Price is required!"],
        min: [0, "Price must be a positive number!"]
    },

    stock: {
        type: Number,
        required: [true, "Stock is required!"],
        min: [0, "Stock cannot be negative!"]
    },

    sold: {
        type: Number,
        default: 0
    },

    outOfStock: {
        type: Boolean,
        default: false
    },

    estado: {
        type: Boolean,
        default: true,
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

ProductSchema.pre('save', function (next) {
    this.outOfStock = this.stock <= 0;
    next();
});

export default model('Product', ProductSchema);
