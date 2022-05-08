const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LigaSchema = Schema({
    nombre:String,
    id_creador: { type: Schema.Types.ObjectId, ref: 'Usuarios'},
    equipos: [{
        equipo: String,
        golesAfavor: Number,
        golesEncontra: Number,
        golesDiferencia: Number,
        partidosJugados: Number,
        puntos:Number
    }],
});

module.exports = mongoose.model('Ligas',LigaSchema);
