import { Schema, model } from "mongoose";

const ProductSchema = Schema({
    type: {
        type: String,
        required: [true, "Type is required!"],
    },

    name: {
        type: String,
        required: [true, "The name is required!"],
        maxLenght: 25,
    },

    description: {
        type: String,
        required: [true, "Desription is required!"],
        maxLenght: [500, "500 characters maximun!"],
    },

    price: {
        type: Number,
        required: [true, "Price is required!"],
        minLenght: [2, "2 numbers minimun!"],
        maxLenght: [5, "5 numbers maximun!"]
    },

    estado: {
        type: Boolean,
        default: true,
    }
},
    {
        timestamps: true,
        versionkey: false
    }
);

export default model('Product', ProductSchema);