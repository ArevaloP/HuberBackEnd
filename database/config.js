const mongoose = require('mongoose');

const dbConnection = async ()=>{

    try {
        await mongoose.connect(process.env.MONGO_CONN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Base de datos Online');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la conexion con la base de datos');
    }

}

module.exports = {
    dbConnection
}