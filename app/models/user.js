var mongoose = require('./db.js');
var bcrypt = require('bcrypt');
var fs = require('fs');
var request = require('request')

//User data modelling and related DB steps below below

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
    }
}, {
    versionKey: false
});


var user = mongoose.model('User', userSchema, 'users');

module.exports = user;