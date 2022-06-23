const {Schema, model} = require('mongoose');

const ProductSchema = Schema({
    type: {
        type: String,
        required: [true, 'El tipo es obligatorioa']
    },
    city: {
        type: String,
        required: [true, 'La ciudad es obligatorioa']
    },
    address: {
        type: String,
        required: [true, 'La direccion es obligatoria']
    },
    price: {
        type: String,
        required: [true, 'El precio debe ser obligatorio']
    },
    desc: {
        type: String,
        required: [true, 'La desc debe ser obligatorio']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imgs: {
        type: String
    },
    date: {
        type: String,
        required: true
    }
});

ProductSchema.methods.toJSON = function () {
    const { __v, _id, ...product } = this.toObject();
    product.uid = _id;
    return product;
}

module.exports = model('Product', ProductSchema);