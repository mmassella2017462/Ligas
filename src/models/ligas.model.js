const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LigaSchema = Schema({
    nombre:String,
    id_creador: { type: Schema.Types.ObjectId, ref: 'Usuarios'},
    
});

module.exports = mongoose.model('Ligas',LigaSchema);
