import { Schema, model } from "mongoose";

const CategorySchema = Schema({
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

    productos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],

    status: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false
    });

export default model('Category', CategorySchema);
