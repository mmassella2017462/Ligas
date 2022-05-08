const mongoose = require('mongoose');
const app = require('./app');


const UsuarioCont = require('./src/controllers/usuario.controller');

mongoose.Promise = global.Promise;                                                                  //function (){}
mongoose.connect('mongodb://localhost:27017/Torneos', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Se encuentra conectado a la base de datos.");

    app.listen(3000, function () {
        console.log("Torneos-Ligas, esta corriendo en el puerto 3000!")
         UsuarioCont.RegistrarAd();

    })


}).catch(error => console.log(error));