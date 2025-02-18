import { Schema, model } from "mongoose";

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, "The name is required!"],
        maxLenght: 25,
    },

    surname: {
        type: String,
        required: [true, "The name is required!"],
        maxLenght: [25, "25 characters maximun!"],
    },

    username: {
        type: String,
        unique: true,
    },

    email: {
        type: String,
        required: [true, "The email is required!"],
        unique: true,
    },

    password: {
        type: String,
        required: [true, "The password is required!"],
        minLenght: [8, "8 minumun characters!"],
    },

    profile: {
        type: String,
    },

    phone: {
        type: String,
        minLenght: 8,
        maxLenght: 8,
        required: [true, "The phone is required!"],
    },

    role: {
        type: String,
        default: "CLIENT_ROLE",
    },

    estado: {
        type: Boolean,
        default: true,
    },

    google: {
        type: Boolean,
        default: false,
    },
},
    {
        timestamps: true,
        versionkey: false
    }
);

UserSchema.methods.toJSON = function () {
    const { _v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model('User', UserSchema);