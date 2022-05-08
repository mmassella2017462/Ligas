const express = require('express');
const controlUsuario = require('../controllers/usuario.controller');
const md_aut = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/validaciones');

const api = express.Router();




api.post('/registrar', controlUsuario.RegistrarUsuario);
api.post('/registrarporAdmin', [md_aut.Auth, md_roles.verAdmin], controlUsuario.RegistraAdmin);
api.post('/login', controlUsuario.Login);
api.put('/editarUser/:idUser', [md_aut.Auth, md_roles.verAdmin], controlUsuario.EditarUsuario);
api.delete('/eliminarUser/:idUser', [md_aut.Auth, md_roles.verAdmin], controlUsuario.EliminarUsuario);
api.put('/editarPerfil', md_aut.Auth, controlUsuario.EditarPerfil);
api.delete('/eliminarPerfil', md_aut.Auth, controlUsuario.EliminarPerfil);
api.get('/visualizarUsuarios',[md_aut.Auth, md_roles.verAdmin], controlUsuario.visualizarClientes);
api.get('/verPerfil',md_aut.Auth, controlUsuario.VerPerfil);



module.exports = api;