const {Schema, model} = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre el obligatorioa']
    },
    lastName: {
        type: String,
        required: [true, 'El apellido el obligatorioa']
    },
    email: {
        type: String,
        required: [true, 'El correo el obligatorioa'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña debe ser obligatorio']
    },
    phone: {
        type: String,
        required: [true, 'El telefono debe ser obligatorio']
    },
    city: {
        type: String,
        required: [true, 'El telefono debe ser obligatorio']
    },
    img: {
        type: String,
        default: "https://res.cloudinary.com/dvlbqeeuw/image/upload/v1655848745/avatar_brxmkz.jpg"
    },
    stade: {
        type: Boolean,
        default: false
    }
});

UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model('User', UserSchema);