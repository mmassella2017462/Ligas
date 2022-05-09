const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EquipoSchema = Schema({
    
    id_liga: { type: Schema.Types.ObjectId, ref: 'Ligas'},
        equipo: String,
        golesAfavor: Number,
        golesEncontra: Number,
        golesDiferencia: Number,
        partidosJugados: Number,
        puntos:Number
    
    
});

module.exports = mongoose.model('Equipos',EquipoSchema);
