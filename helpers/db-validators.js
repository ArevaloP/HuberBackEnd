const Product = require("../models/product");
const User = require("../models/user")


const emailExist = async (email='')=>{
    const existEmail = await User.findOne({email});
    if(existEmail){
        throw new Error(`El correo ${email} ya está registrado.`);
    } 
}

const existUserById = async (id)=>{
    const existUser = await User.findById(id);
    if( !existUser ){
        throw new Error('El id enviado no existe');
    }
}

const existProductById = async (id)=>{
    const existProduct = await Product.findById(id);

    if(!existProduct){
        throw new Error('El id no eciste en la db');
    }
}

module.exports = {
    emailExist,
    existUserById,
    existProductById
}