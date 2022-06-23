const { request, response } = require("express");
const { format } = require("../helpers/format-date");
const Product = require("../models/product");

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const postProducts = async(req=request, res=response)=>{
    
    try {
        const {...body} = req.body;

        const imgs = req.files.image;

        const {secure_url} = await cloudinary.uploader.upload(imgs.tempFilePath, {
                    secure: true,
                    transformation: [
                        {
                            width: 800,
                            height: 450,
                            gravity: "faces",
                            crop: "fill"
                        }
                    ]
                });

        body.imgs = secure_url;

        // let img;

        // const imgs = [];

        // for(let i = 0; i<Number(cantImg); i++){
        //     img = files[`image${i}`]

        //     const {secure_url} = await cloudinary.uploader.upload(img.tempFilePath, {
        //         secure: true,
        //         transformation: [
        //             {
        //                 width: 800,
        //                 height: 450,
        //                 gravity: "faces",
        //                 crop: "fill"
        //             }
        //         ]
        //     })
        //     imgs.push(secure_url)
        // }

    
        const data = {
            ...body,
            user: req.usuarioAuth._id,
            date: format(new Date()),
        }
    
        const product = new Product(data);
    
        await product.save();
    
        return res.status(201).json({
            ok: true,
            product
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Algo sucedió en el navegador a la hora de insertar un producto'
        });
    }


}

const getProducts = async(req=request, res=response)=>{

    try {
        
        const [products] = await Promise.all([

            Product.find().populate('user')
        ]
        );
    
        return res.status(200).json({
            ok: true,
            products
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Algo ocurrio en el servidor'
        })
    }


}


const getProductoByIdUser = async(req=request, res=repsonse)=>{

    try {
        const {idUser} = req.params;
        console.log(idUser);
    
        const produts = await Product.find({user: idUser}).populate('user');
    
        return res.status(200).json({
            ok: true,
            produts
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error en el servidor'
        });
    }



}

const deleteProduct = async(req=request, res=response)=>{
    
    try {
        const {id} = req.params;
    
        const producto = await Product.findByIdAndDelete(id);
    
        return res.status(201).json({
            ok: true,
            producto
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
    
}

module.exports = {
    postProducts,
    getProducts,
    getProductoByIdUser,
    deleteProduct
}