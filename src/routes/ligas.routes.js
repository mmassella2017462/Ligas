const express = require('express');
const controlLiga = require('../controllers/ligas.controller');
const md_aut = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/validaciones');

const api = express.Router();




api.post('/registrarLiga', md_aut.Auth, controlLiga.RegistrarLiga);
api.put('/editarLiga/:idlig', md_aut.Auth, controlLiga.editarLiga);
api.get('/vermisLigas', md_aut.Auth, controlLiga.vermisLigas);
api.delete('/eliminarLiga', md_aut.Auth, controlLiga.EliminarLiga);

//ADMIN
api.put('/editarLigas/:idlig', [md_aut.Auth, md_roles.verAdmin], controlLiga.editarLigas);
api.delete('/eliminarLigas', [md_aut.Auth, md_roles.verAdmin], controlLiga.EliminarLigas);
api.get('/verLigas', [md_aut.Auth, md_roles.verAdmin], controlLiga.verLigas);

api.put('/editarEquipo/:idProd',[md_aut.Auth, md_roles.verCliente], controlLiga.EditarEquipo);
api.delete('/eliminarEquipo', [md_aut.Auth, md_roles.verCliente], controlLiga.EliminarEquipo);
api.post('/registrarEquipo',[md_aut.Auth, md_roles.verCliente], controlLiga.RegistrarEquipo);
api.get('/verEquipos',[md_aut.Auth, md_roles.verCliente], controlLiga.equiposLiga);
api.put('/editarEquipo/:idProd',[md_aut.Auth, md_roles.verCliente] , controlLiga.EditarEquipo);



module.exports = api;