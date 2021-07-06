const mongoose = require('mongoose');

const rutaSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ownerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    usersSubscribed: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    date: {type: Date, required: true},
    startingLatitude: {type: String, required: true},
    startingLongitude: {type: String, required: true},
    endingLatitude: {type: String, required: true},
    endingLongitude: {type: String, required: true},
});

module.exports = mongoose.model('Ruta', rutaSchema);