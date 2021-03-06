const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JornadaSchema = Schema({
    nombre:String,
    id_liga: { type: Schema.Types.ObjectId, ref: 'Ligas'},
    resultados: [{
        equipoGanador: String,
        equipoPerdedor: String,
        marcador: Number
    }],
});

module.exports = mongoose.model('Jornadas',JornadaSchema);
