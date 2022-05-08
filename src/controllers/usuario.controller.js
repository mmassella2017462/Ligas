const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');


function RegistrarAd(req, res) {
    
    let usuarioModel = new Usuario();

    usuarioModel.nombre='Admin';
    usuarioModel.usuario = 'Admin';
    usuarioModel.email = 'adminsitracion@gmail.com';
    usuarioModel.rol = 'ADMIN';
    usuarioModel.password = 'deportes123'

    Usuario.find({$or:[  {usuario: usuarioModel.usuario} ]}).exec((err, buscarUsuario)=>{
        
        if(err) return console.log("ERROR en la peticion")  
        if(buscarUsuario && buscarUsuario.length>=1){
            console.log("El usuario Admin ya existe ")
        }else{
            bcrypt.hash(usuarioModel.password,null,null, (err, passCrypt)=>{
                usuarioModel.password = passCrypt;
            })

            usuarioModel.save((err,usuarioGuardado)=>{
                if(err) return console.log( "ERROR al crear el usuario Admin" )

                if(usuarioGuardado){
                    console.log( {Usuario: usuarioGuardado} )
                }
            })
        }
    })

   
}



//Registro de un nuevo usuario por Admin
function RegistraAdmin(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuario();

    if(parametros.usuario &&parametros.nombre && parametros.apellido &&   
        parametros.email && parametros.password) {
            usuarioModel.nombre = parametros.nombre;
            usuarioModel.apellido = parametros.apellido;
            usuarioModel.usuario = parametros.usuario;
            usuarioModel.email = parametros.email;
            usuarioModel.rol = 'CLIENTE';
            

            Usuario.find({ email : parametros.email }, (err, usuarioEncontrado) => {
                if ( usuarioEncontrado.length == 0 ) {

                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        usuarioModel.password = passwordEncriptada;

                        usuarioModel.save((err, usuarioGuardado) => {
                            if (err) return res.status(500)
                                .send({ mensaje: 'Error en la peticion' });
                            if(!usuarioGuardado) return res.status(500)
                                .send({ mensaje: 'Error al agregar el Usuario'});
                            
                            return res.status(200).send({ usuario: usuarioGuardado });
                        });
                    });                    
                } else {
                    return res.status(500)
                        .send({ mensaje: 'Este correo, ya  se encuentra utilizado' });
                }
            })
    }else {
        return res.status(404)
            .send({ mensaje : 'Debe ingresar los parametros obligatorios'})
    }
}


function EditarUsuario(req, res) {
    var idUser = req.params.idUser;
    var parametros = req.body;
    
    delete parametros.password

    Usuario.findOne({_id:idUser},(err,encontrado)=>{
        if(err) return res.status(200).send('error en la peticion');
        if(!encontrado) return res.status(200).send('no se encontro usuario');
        if(encontrado.rol !== 'CLIENTE'){
            return res.status(200).send({ mensaje:'no puede editar a otro administrador' });
        }
        Usuario.findByIdAndUpdate(encontrado._id, parametros, { new : true } ,(err, usuarioEditado)=>{
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if(!usuarioEditado) return res.status(404)
                .send({ mensaje: 'Error al editar los datos  del Usuario' });
    
            return res.status(200).send({ usuario: usuarioEditado});
        })

    })
}


function EliminarUsuario(req, res) {
    var idUser= req.params.idUser;

    Usuario.findOne({_id:idUser},(err,encontrado)=>{
        if(err) return res.status(200).send('error en la peticion');
        if(!encontrado) return res.status(200).send('no se encontro usuario');
        if(encontrado.rol !== 'CLIENTE'){
            return res.status(200).send({ mensaje:'no puede eliminar a otro administrador' });
        }

            Usuario.findByIdAndDelete(encontrado._id, (err, usuarioEliminado)=>{
           
                if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if(!usuarioEliminado) return res.status(500)
                    .send({ mensaje: 'Error al eliminar el usuario' })
        
                return res.status(200).send({ user: usuarioEliminado });
            }
        )        
    })
   
}







//Registro de un nuevo usuario publico
function RegistrarUsuario(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuario();

    if(parametros.usuario &&parametros.nombre && parametros.apellido &&   
        parametros.email && parametros.password) {
            usuarioModel.nombre = parametros.nombre;
            usuarioModel.apellido = parametros.apellido;
            usuarioModel.usuario = parametros.usuario;
            usuarioModel.email = parametros.email;
            usuarioModel.rol = 'CLIENTE';
            

            Usuario.find({ email : parametros.email }, (err, usuarioEncontrado) => {
                if ( usuarioEncontrado.length == 0 ) {

                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        usuarioModel.password = passwordEncriptada;

                        usuarioModel.save((err, usuarioGuardado) => {
                            if (err) return res.status(500)
                                .send({ mensaje: 'Error en la peticion' });
                            if(!usuarioGuardado) return res.status(500)
                                .send({ mensaje: 'Error al agregar el Usuario'});
                            
                            return res.status(200).send({ usuario: usuarioGuardado });
                        });
                    });                    
                } else {
                    return res.status(500)
                        .send({ mensaje: 'Este correo, ya  se encuentra utilizado' });
                }
            })
    }else {
        return res.status(404)
            .send({ mensaje : 'Debe ingresar los parametros obligatorios'})
    }
}



//Funciones unicas de solo una accion 
//(el cliente solo podra editarse a si mismo o eliminar solamente su perfil)
function EditarPerfil(req, res) {
    var logeado = req.user;
   
    var parametros = req.body;
    
    delete parametros.password
    delete parametros.rol
   
    Usuario.findByIdAndUpdate(logeado.sub, parametros, { new : true } ,(err, usuarioEditado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!usuarioEditado) return res.status(404)
            .send({ mensaje: 'Error al Editar el registro del Usuario' });

        return res.status(200).send({ usuario: usuarioEditado});
    })
}


function EliminarPerfil(req, res) {
    var logeado = req.user;

    Usuario.findByIdAndDelete(logeado.sub, (err, usuarioEliminado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!usuarioEliminado) return res.status(500)
            .send({ mensaje: 'Error al eliminar el Perfil' })

        return res.status(200).send({ perfil_eliminado: usuarioEliminado });
    })
}

function VerPerfil(req, res) {
    var logeado = req.user;
       
    Usuario.find({_id:logeado.sub},(err, usuarioEditado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!usuarioEditado) return res.status(404)
            .send({ mensaje: 'Error al encontrar el perfil del Usuario' });

        return res.status(200).send({ usuario: usuarioEditado});
    })
}

//Uso general 
function Login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ email : parametros.email }, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(usuarioEncontrado){
            // COMPARO CONTRASENA SIN ENCRIPTAR CON LA ENCRIPTADA
            bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword)=>{//TRUE OR FALSE
                    // VERIFICO SI EL PASSWORD COINCIDE EN BASE DE DATOS
                    if ( verificacionPassword ) {
                        // SI EL PARAMETRO OBTENERTOKEN ES TRUE, CREA EL TOKEN
                        if(parametros.Token === 'true'){
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return  res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        }

                        
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contrasena no coincide'});
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el correo no se encuentra registrado.'})
        }
    })
}




//Uso exclusivo Admin
function visualizarClientes(req, res) {
    
    let usuarioModel = new Usuario();

   
    usuarioModel.rol = 'CLIENTE';
   

    Usuario.find({$or:[  {rol: usuarioModel.rol} ]}).exec((err, buscarUsuario)=>{
        
        if(err) return console.log("ERROR en la peticion")  
            return res.status(200).send({ Usuarios_Encontrados:  buscarUsuario })

  
    })
}






module.exports = {
    RegistrarAd,
    RegistraAdmin,
    RegistrarUsuario,
    Login,
    EditarUsuario,
    EliminarUsuario,
    visualizarClientes,
    EditarPerfil,
    EliminarPerfil,
    VerPerfil
}
