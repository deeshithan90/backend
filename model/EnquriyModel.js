const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    FullName: {
        type: String,
        required: true
    },
    Phone: {
        type: String,
        required: true,
        unique: true
    },
    Email: {
        type: String,   // <-- Fix here
        required: true,
        unique: true
    },
    DisCribe: {
        type: String,
        required: true
    }
});

const UserModel = mongoose.model('Enquriy', UserSchema);

module.exports = UserModel;