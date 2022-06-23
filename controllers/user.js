const { request, response } = require("express");
const bycryptjs = require('bcryptjs');
const cloudinary = require('cloudinary').v2;

const User = require("../models/user");
const { generarJWT } = require("../helpers/generar-jwt");


cloudinary.config(process.env.CLOUDINARY_URL);

const postUser = async(req=request, res=response)=>{


    try {
        //Recibir los datos del request
        const {name, lastName, email, password, phone, city} = req.body;

        const existEmail = await User.findOne({email});
        if (existEmail){
            return res.status(400).json({
                ok: false,
                msg: `El correo ${email} ya está registrado en la base de datos`
            });
        }
     
        //Creamos un nuevo usuario para ingresarlo a la base de datos
        const user = new User({
            name,
            lastName,
            email,
            password,
            phone,
            city
        });
    
        //Encriptamos la contraseña son 10 vueltas por default
        const salt = bycryptjs.genSaltSync();
        user.password = bycryptjs.hashSync(password, salt);

        
        //Guardamos el usuario en la base de datos
        await user.save();

        //Generar jwt
        const token = await generarJWT(user.id);
        
        //Generamos la respuesta
        return res.status(201).json({
            ok: true,
            user,
            token
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error en el servidor'
        })
    }

}

const actualizarImage = async(req=request, res=response) => {
    
    try {
        const {id} = req.params;

        const user = await User.findById(id);

        console.log("paso por aquí");
        

        const img = req.files.image;

        console.log(img);
        
        const {secure_url} = await cloudinary.uploader.upload(img.tempFilePath, {
            secure: true,
            transformation: [
                {
                    width: 500,
                    height: 500,
                    gravity: "face",
                    crop: "thumb"
                }
            ]
        });

        user.img = secure_url;
        await user.save();

        return res.status(201).json({
            ok: true,
            user
        });

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error en el servidor'
        })
    }
    
    
    
}

const putUser = async(req=request, res=response)=>{
    const {id} = req.params;

    const {_id, password, correo, ...resto} = req.body;

    if(password){
        const salt =  bycryptjs.genSaltSync();
        resto.password = bycryptjs.hashSync(password, salt);
    }

    const usuario = await User.findByIdAndUpdate(id, resto, {new: true});

    res.status(201).json({
        ok: true,
        usuario
    })
}

const observarImage = async(req=request, res=response) => {
    
    const body = req.files.myFile;

    console.log(body);
    return res.json({
        ok: true,
        msg: 'todo bien!'
    });
}

const revalidarToken = async(req=request, res=response)=>{

    const {usuarioAuth} = req; 

    const token = await generarJWT(usuarioAuth.id);
    console.log(usuarioAuth.id);
    
    return res.json({
        ok: true,
        usuarioAuth,
        token
    });

}

const getUserById = async(req=request, res=response)=>{


    try {
        const {id} = req.params;
    
        const usuario = await User.findById(id);

        return res.status(200).json({
            ok: true,
            usuario
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        });
    }




}

const loginUser = async (req=request, res=response)=>{

    const {email, password} = req.body;

    try {
        
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                ok: false,
                msg: "Correo o Contraseña no son correctos"
            });
        }

        const validPassword = bycryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "Correo o Contraseña no son correctos",
            });
          }

          const token = await generarJWT(user.id);

          return res.status(200).json({
            ok: true,
            user,
            token
          })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Algo salio mal",
          });
    }

}


const validarPassword = async (req=request, res=response)=>{
    const {id} = req.params;

    const {password} = req.body;

    try {
        const usuario = await User.findById(id);


        const validPassword = bycryptjs.compareSync(password, usuario.password);

        if(!validPassword){
            return res.json({
                ok: false,
                msg: 'Las contraseñas nos son iguales'
            });
        }

        return res.json({
            ok: true,
            msg: 'Las contraseñas son iguales'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrio algo en el servidor - validarPassword'
        });
    }
}




module.exports = {
    postUser,
    actualizarImage,
    revalidarToken,
    loginUser,
    putUser,
    observarImage,
    validarPassword,
    getUserById
}