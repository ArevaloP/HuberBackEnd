const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validarJWT = async (req=request , res=response, next)=>{

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({ 
            msg: 'No hay token en la peticion'
        });
    }

    try {
        
        const {uid} = jwt.verify(token, process.env.SECRETOPRIVATEKEY);
        
        
        
         
        
        const usuario = await User.findById(uid);

        if(!usuario){
            return res.status(401).json({
                ok: false,
                msg: 'Token no valido - usuario no existe db'
            });
        }

        //Verificar si el uid tiene el estado en true
        // if(!usuario.estado){
        //     return res.status(401).json({
        //         msg: 'Token no valido - usuario con estado false'
        //     });
        // }

        req.usuarioAuth = usuario;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }

}

module.exports = {
    validarJWT
}