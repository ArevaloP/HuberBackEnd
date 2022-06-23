const { request, response } = require("express");

const extensiones = ['png', 'jpg', 'jpeg', 'gif'];

const validarArchivo = (req=request, res=response, next)=>{

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.image) {
        return res.status(400).json({
            ok: false,
            msg: "No hay archivos que subir - archivo"
        });
      }

      const {image} = req.files;
      const nombreCortado = image.name.split('.');
      const extension = nombreCortado[nombreCortado.length - 1];
      if(!extensiones.includes(extension)){
        return res.status(400).json({
            ok: false,
            msg: 'La extension enviada no es permitida'
        });
      }


      next();

}

module.exports = {
    validarArchivo
}