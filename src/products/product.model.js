import { Schema, model } from "mongoose";

const ProductSchema = Schema({
    type: {
        type: String,
        required: [true, "Type is required!"],
    },

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

    estado: {
        type: Boolean,
        default: true,
    }
},
    {
        timestamps: true,
        versionKey: false
    });

export default model('Product', ProductSchema);
