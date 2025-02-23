import { Schema, model } from "mongoose";

const CarSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1
            }
        }
    ],

    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Car', CarSchema);
