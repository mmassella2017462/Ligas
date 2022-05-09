const Liga = require('../models/ligas.model');
const Equipo = require('../models/equipos.model');

//Acciones sobre categorias  exclusivas pal Admin

function RegistrarLiga(req, res) {
    var parametros = req.body;
    var liga = new Liga();
    var logeado = req.user;

    if(parametros.nombre ) {
            liga.nombre = parametros.nombre;
            liga.id_creador = logeado.sub;

            Liga.find({ nombre : parametros.nombre }, (err, catEncontrado) => {
                if ( catEncontrado.length == 0 ) {

                    liga.save((err, usuarioGuardado) => {
                        if (err) return res.status(500)
                            .send({ mensaje: 'Error en la peticion' });
                        if(!usuarioGuardado) return res.status(500)
                            .send({ mensaje: 'Error al agregar la Liga'});
                        
                        return res.status(200).send({Liga_Creada: usuarioGuardado });
                    });                 
                } else {
                    return res.status(500)
                        .send({ mensaje: 'Esta Liga ya existe' });
                }
            })
    }
}


function editarLiga(req, res) {
    var lig = req.params.idlig;
    var parametros = req.body;
    var logeado = req.user;
     
    Liga.findOne({ _id: lig }, (err, catEncontrada) => {
        if (!catEncontrada) {
            return res.status(400).send({ mensaje: 'verifica el nombre de la Liga' });
        }  
        Liga.find({id_creador: logeado.sub}, (err, catEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
            if (!catEncontrado) return res.status(500).send({ mensaje: 'Verficia que sea tuya la Liga' })
            
            Liga.findByIdAndUpdate(catEncontrada._id, parametros, { new : true } ,(err, catEditado)=>{
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if(!catEditado) return res.status(404)
                    .send({ mensaje: 'Error al editar los datos  de la  Liga' });
        
                return res.status(200).send({ Liga_Editada: catEditado});
            })   
            
        })
         
    }
        
        )}
    

    

function EliminarLiga(req, res) {
    var parametros = req.body;
    var logeado = req.user;

    Liga.findOne({ nombre: parametros.liga }, (err, catEncontrada) => {
        if (!catEncontrada) {
            return res.status(400).send({ mensaje: 'verifica el nombre de la Liga' });
        } 
        Liga.find({id_creador: logeado.sub}, (err, catEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
            if (!catEncontrado) return res.status(500).send({ mensaje: 'Verficia que sea tuya la Liga' })
       
            Equipo.deleteMany( { id_liga : catEncontrada._id} )

         Liga.findByIdAndDelete(catEncontrada._id, (err, catEliminada)=>{
            if(err) return res.status(400).send({ mensaje: "Error en la peticion de eliminar la liga"});
            if(!catEliminada) return res.status(400).send({ mensaje: "Error al eliminar la Liga"});

            return res.status(200).send({ 
                Liga_eliminada: catEliminada
            })
        })

       
       
        })
        
    })

   
}


function vermisLigas(req, res) {
    
    var logeado = req.user;
    Liga.find({id_creador: logeado.sub}, (err, catEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!catEncontrado) return res.status(500).send({ mensaje: 'Error al buscar empresa' })

        return res.status(200).send({ Mis_Ligas: catEncontrado })
    })
}


//FUNCIONES ADMINISTRADOR
function editarLigas(req, res) {
    var lig = req.params.idlig;
    var parametros = req.body;
   
     
    Liga.findOne({ _id: lig }, (err, catEncontrada) => {
        if (!catEncontrada) {
            return res.status(400).send({ mensaje: 'verifica el nombre de la Liga' });
        }  
        Liga.findByIdAndUpdate(catEncontrada._id, parametros, { new : true } ,(err, catEditado)=>{
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if(!catEditado) return res.status(404)
                .send({ mensaje: 'Error al editar los datos  de la  Liga' });
    
            return res.status(200).send({ Liga_Editada: catEditado});
        })  
         
    }
        
        )}
    

    

function EliminarLigas(req, res) {
    var parametros = req.body;
   
    Liga.findOne({ nombre: parametros.liga }, (err, catEncontrada) => {
        if (!catEncontrada) {
            return res.status(400).send({ mensaje: 'verifica el nombre de la Liga' });
        } 
        Equipo.deleteMany( { id_liga : catEncontrada._id} )

        Liga.findByIdAndDelete(catEncontrada._id, (err, catEliminada)=>{
           if(err) return res.status(400).send({ mensaje: "Error en la peticion de eliminar la liga"});
           if(!catEliminada) return res.status(400).send({ mensaje: "Error al eliminar la Liga"});

           return res.status(200).send({ 
               Liga_eliminada: catEliminada
           })

       
       
        })
        
    })
}

function verLigas(req, res) {
    
    Liga.find({}, (err, catEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!catEncontrado) return res.status(500).send({ mensaje: 'Error al buscar empresa' })

        return res.status(200).send({ Todas_Ligas: catEncontrado })
    })
}

//Acciones sobre Equipos
function RegistrarEquipo(req, res) {
    var parametros = req.body;
    var equipo = new Equipo();

    if(parametros.nombre&&parametros.liga) {

        Liga.findOne({ nombre: parametros.liga }, (err, catEncontrada) => {
            if (!catEncontrada) {
                return res.status(400).send({ mensaje: 'verifica el nombre de la Liga' });
            }

            equipo.equipo = parametros.nombre;
            equipo.id_liga = catEncontrada._id;
            
            Equipo.find({ equipo : parametros.nombre }, (err, catEncontrado) => {
                if ( catEncontrado.length == 0 ) {

                    equipo.save((err, prodGuardado) => {
                        if (err) return res.status(500)
                            .send({ mensaje: 'Error en la peticion' });
                        if(!prodGuardado) return res.status(500)
                            .send({ mensaje: 'Error al agregar el equipo'});
                        
                        return res.status(200).send({Equipo: prodGuardado });
                    })              
                } else {
                    return res.status(500)
                        .send({ mensaje: 'Este Equipo ya esta registrado en la base de datos ' });
                }
            })

        })
            
    }
}



function EditarEquipo(req, res) {
    var idProd = req.params.idProd;
    var parametros = req.body;
    var logeado = req.user;

    Liga.findOne({ nombre: parametros.liga }, (err, catEncontrada) => {
        if (!catEncontrada) {
            return res.status(400).send({ mensaje: 'verifica el nombre de la Liga' });
        }  
        Liga.find({id_creador: logeado.sub}, (err, catEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
            if (!catEncontrado) return res.status(500).send({ mensaje: 'Verficia que sea tuya la Liga' })
           
            Equipo.findByIdAndUpdate(idProd ,{id_liga: catEncontrada._id ,parametros}, { new : true } ,(err, prodEditado)=>{

                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if(!prodEditado) return res.status(404)
                    .send({ mensaje: 'Error al editar los datos  del Equipo' });
        
    
                return res.status(200).send({ Equipo_Edit: prodEditado});
            })
        
        
        })
        
    })
}

function EliminarEquipo(req, res) {

    var parametros = req.body;
   
    Equipo.findOne({ equipo: parametros.nombre }, (err, catEncontrada) => {
        if (!catEncontrada) {
            return res.status(400).send({ mensaje: 'verifica el nombre de la Liga' });
        } 

        Equipo.findByIdAndDelete(catEncontrada._id, (err, catEliminada)=>{
           if(err) return res.status(400).send({ mensaje: "Error en la peticion de eliminar la liga"});
           if(!catEliminada) return res.status(400).send({ mensaje: "Error al eliminar la Liga"});

           return res.status(200).send({ 
               Equipo_eliminado: catEliminada
           })

    
     })

    })
    
}





function equiposLiga(req, res) {
    var parametros = req.body;

    Liga.findOne({ nombre: parametros.liga }, (err, catEncontrada) => {
        if (!catEncontrada) {
            return res.status(400).send({ mensaje: 'verifica el nombre de la Liga' });
        }  

        Equipo.find({id_liga: catEncontrada._id ,parametros},(err, prodEditado)=>{

            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if(!prodEditado) return res.status(404)
                .send({ mensaje: 'Error al encontrar los equipos  de la Liga' });
    

            return res.status(200).send({ Equipos_Liga: prodEditado});
        })
    
    })
}


module.exports={
RegistrarLiga,
editarLiga,
EliminarLiga,
vermisLigas,
editarLigas,
EliminarLigas,
verLigas,
RegistrarEquipo,
EditarEquipo,
EliminarEquipo,
equiposLiga
}
