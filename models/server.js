const express = require('express');
const { dbConnection } = require('../database/config');
const cors = require('cors');
const fileUpload = require('express-fileupload');



class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            user: '/api/users',
            product: '/api/products'
        };

        //Coneccion a base de datos
        this.connDB();

        //Middlewares
        this.middlewares();

        //Rutas
        this.routes();

    }

    async connDB(){
        await dbConnection();
    }

    middlewares(){
        //CORS
        this.app.use(cors());

        //Parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));

        //Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp',
            createParentPath: true
        }));
    }

    routes(){
        this.app.use(this.paths.user, require('../routes/user'));
        this.app.use(this.paths.product, require('../routes/porducts'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`);
        });
    }

}

module.exports = Server;